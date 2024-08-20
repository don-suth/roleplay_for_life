"""
Server Controller for the Roleplay for Life Stream overlay.
"""
import json
import aiohttp
from bs4 import BeautifulSoup
from decimal import Decimal
from datetime import datetime
import asyncio
import websockets

RELAY_FOR_LIFE_PAGE = "https://www.relayforlife.org.au/fundraisers/UnigainsgoesUnisfast"
SERVER_SAVE_STATE_FILENAME = "server_saved_state.json"
HOST = "localhost"
PORT = 8765

class StateManager:
    def __init__(self):
        self.CLIENTS = set()
        self.STATE = {
            "last_donation_timestamp": 0.0,
            "last_raised": "0"
        }
    
    def save(self):
        return self.STATE
    
    def load(self, json_state):
        self.STATE = json_state

sm = StateManager()

async def handle_json(json_message, source_websocket):
    match json_message.get("operation"):
        case "update":
            # Update our local data, and then distribute to all clients.
            sm.STATE.update(json_message.get("data", {}))
            for client in sm.CLIENTS:
                await client.send(json.dumps(json_message))
        case "check":
            # Respond with the current state.
            response = {
                "operation": "update",
                "data": sm.STATE
            }
            await source_websocket.send(json.dumps(response))
        case None:
            print("Message with unknown protocol received.")
        

async def get_donation_data():
    async with aiohttp.ClientSession() as session:
        async with session.get(RELAY_FOR_LIFE_PAGE) as response:
            html = await response.text()
            soup = BeautifulSoup(html, features="html.parser")
        
        donations = soup.find_all(class_="donation")
        page_total = soup.find(class_="iveRaised").h3.text.strip().strip("$")
        visual_total = Decimal()
        new_donations = []
        
        for donation in donations:
            donation_data = donation.find(class_="donation-filter").attrs
            donation_time = datetime.strptime(donation_data["data-date"], "%Y-%m-%d %H:%M:%S").timestamp()
            
            if donation_time <= sm.STATE["last_donation_timestamp"]:
                # We already have this donation recorded. Ignore it.
                pass
            else:
                donation_comments = donation.find(class_="comments").text.strip()
                donation_amount = donation.find(class_="amount").text.strip().strip("$")
                
                # In the rare case that someone donates a lot of money,
                # we might be given a donation that looks like "$21k".
                # We don't want that to break anything!
                
                if donation_amount.lower().endswith("k"):
                    donation_amount = str(Decimal(donation_amount.lower().strip("k"))*1000)
                
                donation_name = donation.find(class_="profilename").h3.text.strip()
                
                new_donations.append({
                    "name": donation_name,
                    "amount": donation_amount,
                    "message": donation_comments,
                    "timestamp": donation_time,
                    "new_donation_value": ""
                })
        
        if new_donations:
            # Sort the new donations by timestamp, and
            # then calculate the new total value to show.
            new_donations.sort(key=lambda d: d["timestamp"])
            for donation in new_donations:
                visual_total += Decimal(donation["amount"])
                donation["new_donation_value"] = str(int(Decimal(sm.STATE["last_raised"])+visual_total))
                
            # Make sure the last donation shows the total on the website, regardless.
            new_donations[-1]["new_donation_value"] = page_total
        
        # We will receive an updated timestamp from the client,
        # when they successfully receive the donation data.
        return new_donations
    
async def send_new_donations():
    while True:
        await asyncio.sleep(60)
        new_donations = await get_donation_data()
        if new_donations:
            # Send to all clients.
            json_message = json.dumps({
                "operation": "new_donations",
                "donations": new_donations,
            })
            websockets.broadcast(sm.CLIENTS, json_message)

async def state_manager(websocket):
    sm.CLIENTS.add(websocket)
    print(f"{websocket.remote_address}: connected")
    try:
        async for message in websocket:
            try:
                json_message = json.loads(message)
            except Exception as e:
                print(f"Received invalid JSON: {message}")
                print(e)
                continue
            await handle_json(json_message, websocket)
            print(f"{websocket.remote_address}: {message}")
    finally:
        sm.CLIENTS.remove(websocket)
        print(f"{websocket.remote_address}: disconnected")
        

async def main():
    print("Starting server:")
    try:
        print("Attempting to reload state... ", end="")
        with open(SERVER_SAVE_STATE_FILENAME) as saved_state:
            sm.load(json.load(saved_state))
        print("Done.")
        print(sm.STATE)
    except Exception as e:
        print("Failed!")
        print(e)
    
    try:
        async with websockets.serve(state_manager, HOST, PORT):
            print(f"Running on ws://{HOST}:{PORT}")
            await send_new_donations()
    finally:
        print("Attempting to save state... ", end="")
        with open(SERVER_SAVE_STATE_FILENAME, "w") as saved_state:
            json.dump(sm.save(), saved_state)
        print("Done!")

if __name__ == "__main__":
    asyncio.run(main())
