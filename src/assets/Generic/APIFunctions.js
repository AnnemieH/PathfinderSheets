// Given a value, look for its ID
export default function findID ( val )
{
    // Set id to be a key of val which contains "ID" as a substring (case-sensitive to avoid false positives)
    // If there is no such key, id is undefined
    const id = (Object.keys(val)).find(key => key.includes("ID"));

    return val[id];
}

// Given a value, look for its name
export function findName ( val )
{
    // Set id to be a key of val which contains "Name" as a substring (could return false positives to be careful with data-naming)
    // If there is no such key, name is undefined
    const name = (Object.keys(val)).find(key => key.toLowerCase().includes("name"));

    return val[name];
}