import Contacts
import RaycastSwiftMacros

struct Contact: Codable {
    let id: String
    let name: String
    let phoneNumbers: [String]
}

@raycast func fetchContacts() async throws -> [Contact] {
    let store = CNContactStore()
    
    let authorized = try await store.requestAccess(for: .contacts)
    guard authorized else {
        struct ContactsError: Error, LocalizedError {
            let errorDescription: String
        }
        throw ContactsError(errorDescription: "Access to contacts was denied")
    }
    
    let keysToFetch = [
        CNContactGivenNameKey,
        CNContactFamilyNameKey,
        CNContactPhoneNumbersKey,
        CNContactIdentifierKey
    ] as [CNKeyDescriptor]
    
    let request = CNContactFetchRequest(keysToFetch: keysToFetch)
    var contacts: [Contact] = []
    
    try store.enumerateContacts(with: request) { contact, _ in
        let phoneNumbers = contact.phoneNumbers.map { $0.value.stringValue }
        if !phoneNumbers.isEmpty {
            contacts.append(Contact(
                id: contact.identifier,
                name: [contact.givenName, contact.familyName]
                    .filter { !$0.isEmpty }
                    .joined(separator: " "),
                phoneNumbers: phoneNumbers
            ))
        }
    }
    
    return contacts.sorted { $0.name < $1.name }
}