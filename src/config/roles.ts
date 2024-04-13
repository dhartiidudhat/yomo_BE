import { ROLES } from "./constants";
const roles = Object.values(ROLES);
const roleRights = new Map();
// Admin
roleRights.set(roles[0], ["updateProfile", "getUserById", "getUser", "mapCreate", "connectUsers", "chat", "notification"]);
// Social
roleRights.set(roles[1], ["updateProfile", "getUserById", "getUser", "mapCreate", "connectUsers", "chat", "notification"]);
// Professional
roleRights.set(roles[2], ["updateProfile", "getUserById", "getUser", "mapCreate", "connectUsers", "chat", "notification"]);

export {
    roles,
    roleRights
}