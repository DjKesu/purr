import { LocalStorage } from "@raycast/api";
import { Group } from "./types";

export async function getGroups(): Promise<Group[]> {
  const groupsJson = await LocalStorage.getItem<string>("groups");
  return groupsJson ? JSON.parse(groupsJson) : [];
}

export async function saveGroup(group: Group): Promise<void> {
  const groups = await getGroups();
  groups.push(group);
  await LocalStorage.setItem("groups", JSON.stringify(groups));
}

export async function updateGroup(updatedGroup: Group): Promise<void> {
  const groups = await getGroups();
  const index = groups.findIndex(g => g.id === updatedGroup.id);
  if (index !== -1) {
    groups[index] = updatedGroup;
    await LocalStorage.setItem("groups", JSON.stringify(groups));
  }
}

export async function deleteGroup(groupId: string): Promise<void> {
  const groups = await getGroups();
  const filteredGroups = groups.filter(g => g.id !== groupId);
  await LocalStorage.setItem("groups", JSON.stringify(filteredGroups));
}