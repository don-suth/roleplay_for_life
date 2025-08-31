import asyncio
import aiohttp
from bs4 import BeautifulSoup
from decimal import Decimal
import datetime

RELAY_FOR_LIFE_PAGE = "https://www.relayforlife.org.au/fundraisers/UnigainsgoesUnisfast"

async def get_donation_stats(start_datetime, session_length, number_of_sessions):
	processed_donations = []
	async with aiohttp.ClientSession() as session:
		async with session.get(RELAY_FOR_LIFE_PAGE) as response:
			html = await response.text()
			soup = BeautifulSoup(html, features="html.parser")
		
		donations = soup.find_all(class_="donation")
		for donation in donations:
			donation_data = donation.find(class_="donation-filter").attrs
			donation_amount = str(Decimal(donation_data["data-amount"]).quantize(Decimal("1.00")))
			donation_time = datetime.datetime.strptime(donation_data["data-date"], "%Y-%m-%d %H:%M:%S")
			processed_donations.append(tuple([donation_time, donation_amount]))
	
	session_start_time = start_datetime
	session_end_time = start_datetime + session_length
	
	for i in range(number_of_sessions):
		session_total = Decimal("0.00")
		for time, amount in processed_donations:
			if session_start_time <= time < session_end_time:
				session_total += Decimal(amount).quantize(Decimal("1.00"))
		print(f"Session {i+1} total: ${session_total}")
		
		session_start_time = session_end_time
		session_end_time = session_start_time + session_length


if __name__ == "__main__":
	start_time = datetime.datetime(2025, 8, 30, 12, 00)
	length = datetime.timedelta(hours=6)
	number_of_sessions = 4
	
	tz_offset = datetime.timedelta(hours=2)
	asyncio.run(get_donation_stats(start_time+tz_offset, length, number_of_sessions))
	
	
	