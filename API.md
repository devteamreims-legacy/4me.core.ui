# Backend API

## CWP
 * [4me.core.mapping]/cwp/getMine : returns an object of our CWP (id + friendly name)
```javascript
{
    id: 34, // Unique CWP (or Supervisor/Flow Management position) identifier (Number)
    name: "P32" // CWP friendly name (String)
}
```
 * [4me.core.mapping]/cwp/setMine (?) : do we need this ? Can't we just identify CWPs using an express middleware and the requester's IP address ?

## Sectors
 * [4me.core.mapping]/sectors/getMine : returns an array of our sectors + friendly name
```javascript
{
    sectors: ['UR', 'XR'], // Array of sectors (Array of Strings)
    name: "UXR" // Friendly name of our bound sectors (String)
}
```
 * [4me.core.mapping] WebSocket : sends the same object via websocket for realtime updates