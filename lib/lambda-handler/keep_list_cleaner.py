import os
import gkeepapi

keep = gkeepapi.Keep()


def handler(event, context):
    try:
        print("Starting...")
        email = os.environ['GOOGLE_EMAIL']
        master_token = os.environ['GOOGLE_MASTER_TOKEN']
        keep_note_id = os.environ['KEEP_NOTE_ID']

        print("Authenticating...")
        keep.authenticate(email, master_token)

        print("Getting list...")
        seen_names = set()
        list = keep.get(keep_note_id)
        print(f"Got list \"{list.title}\" with {len(list.items)} items")

        for list_item in list.unchecked + list.checked:
            formatted_name = list_item.text.strip().title()

            if formatted_name in seen_names:
                print(f"Removed Duplicate: {formatted_name}")
                list_item.delete()
                continue

            seen_names.add(formatted_name)
            list_item.text = formatted_name

        print("Number of items after cleanup:", len(list.items))
        print("Syncing to Keep...")
        keep.sync()

        print("Done")
        return {
            "statusCode": 200,
        }
    except Exception as ex:
        print("Exception in handler", ex)
        return {
            "statusCode": 500,
        }
