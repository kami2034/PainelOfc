# Security Specification - Clan Dashboard

## Data Invariants
1. A member cannot exist without a valid clan.
2. Only leaders or co-leaders can post announcements.
3. Users can only read data for the clan they belong to (or a public clan if we allow it, but we'll stick to membership for now).
4. Members can update their own non-sensitive data (e.g. status), but not their role.

## The Dirty Dozen Payloads (Rejection Targets)
1. Creating a clan without a name.
2. Creating a member with a 2MB avatar URL string.
3. Updating a member's role from "member" to "leader" as an unauthenticated user.
4. Posting an announcement with a future timestamp.
5. Deleting a clan as a regular member.
6. Updating a clan's level to a negative number.
7. Joining a clan by spoofing another user's UID.
8. Updating a war log result after it's been finalized.
9. Reading another clan's private announcements.
10. Creating a member without required fields like `trophies`.
11. Injecting a 1MB string into an announcement title.
12. Updating `createdAt` on an existing announcement.

## Rules Logic
- `isValidId(id)`: strictly match alphanumeric + dashes.
- `isClanMember(clanId)`: `exists(/databases/$(database)/documents/clans/$(clanId)/members/$(request.auth.uid))`
- `isClanAdmin(clanId)`: `get(/databases/$(database)/documents/clans/$(clanId)/members/$(request.auth.uid)).data.role in ['leader', 'co-leader']`
