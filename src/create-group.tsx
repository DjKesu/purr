import { Action, ActionPanel, Form, showToast, Toast } from "@raycast/api";
import { useState, useEffect } from "react";
import { getContacts } from "./utils/contacts";
import { saveGroup } from "./utils/storage";
import { Contact, Group } from "./utils/types";

export default function CreateGroup() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchContacts() {
      try {
        const fetchedContacts = await getContacts();
        setContacts(fetchedContacts);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchContacts();
  }, []);

  async function handleSubmit(values: { groupName: string; members: string[] }) {
    try {
      const selectedContacts = contacts.filter(c => values.members.includes(c.id));
      
      const newGroup: Group = {
        id: Date.now().toString(),
        name: values.groupName,
        members: selectedContacts
      };

      await saveGroup(newGroup);

      await showToast({
        style: Toast.Style.Success,
        title: "Group Created",
        message: `${newGroup.name} with ${newGroup.members.length} members`
      });
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to create group",
        message: error instanceof Error ? error.message : "Unknown error occurred"
      });
    }
  }

  return (
    <Form
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField id="groupName" title="Group Name" placeholder="Enter group name" />
      <Form.TagPicker id="members" title="Members">
        {contacts.map(contact => (
          <Form.TagPicker.Item
            key={contact.id}
            value={contact.id}
            title={contact.name + " - " + contact.phone}
          />
        ))}
      </Form.TagPicker>
    </Form>
  );
}