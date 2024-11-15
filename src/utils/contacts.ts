import { showToast, Toast } from "@raycast/api";
import { fetchContacts } from "swift:../../swift";
import { Contact } from "./types";

export async function getContacts(): Promise<Contact[]> {
  try {
    const contacts = await fetchContacts();

    console.log(contacts);  
    
    return contacts.map((contact: Contact) => ({
      id: contact.id,
      name: contact.name,
      phone: contact.phone, // Use first phone number
      selected: false
    }));
  } catch (error) {
    console.error('Error fetching contacts:', error);
    await showToast({
      style: Toast.Style.Failure,
      title: "Failed to fetch contacts",
      message: error instanceof Error ? error.message : "Unknown error occurred"
    });
    
    return [];
  }
}