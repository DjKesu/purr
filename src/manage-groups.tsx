import { ActionPanel, List, Action, Icon, useNavigation } from "@raycast/api";
import { useState, useEffect } from "react";
import { getGroups, deleteGroup } from "./utils/storage";
import { Group } from "./utils/types";

export default function ManageGroups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { push } = useNavigation();

  useEffect(() => {
    async function loadGroups() {
      const loadedGroups = await getGroups();
      setGroups(loadedGroups);
      setIsLoading(false);
    }
    loadGroups();
  }, []);

  async function handleDelete(groupId: string) {
    await deleteGroup(groupId);
    setGroups(await getGroups());
  }

  return (
    <List isLoading={isLoading}>
      {groups.map((group) => (
        <List.Item
          key={group.id}
          title={group.name}
          subtitle={`${group.members.length} members`}
          accessories={[
            { text: group.members.map(m => m.name).join(", ") }
          ]}
          actions={
            <ActionPanel>
              <ActionPanel.Section>
                <Action.Push
                  title="Broadcast Message"
                  icon={Icon.Message}
                  target={<BroadcastMessage group={group} />}
                />
              </ActionPanel.Section>
              <ActionPanel.Section>
                <Action
                  title="Delete Group"
                  icon={Icon.Trash}
                  style={Action.Style.Destructive}
                  onAction={() => handleDelete(group.id)}
                />
              </ActionPanel.Section>
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}

function BroadcastMessage({ group }: { group: Group }) {
  return <List.Item title="Broadcast Message" />;
}