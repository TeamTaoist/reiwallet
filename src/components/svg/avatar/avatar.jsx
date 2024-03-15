import Avatar from 'boring-avatars';
export default function ({size,address}){
    return <Avatar
        size={size}
        name={address}
        variant="marble"
        colors={['#47CDFF', '#47FF98', '#F0AB3D', '#FF8747', '#FF59D4']}
    />
}
