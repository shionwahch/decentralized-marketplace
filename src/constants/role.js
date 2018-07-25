
const Role = Object.freeze({
    ADMIN: 'ADMIN',
    STORE_OWNER: 'STORE_OWNER',
    SHOPPER: 'SHOPPER'
})

const isAdmin = (role) => role === Role.ADMIN
const isStoreOwner = (role) => role === Role.STORE_OWNER
const isShopper = (role) => role === Role.SHOPPER

export { isAdmin, isStoreOwner, isShopper }
export default Role