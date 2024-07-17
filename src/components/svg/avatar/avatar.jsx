import Avatar from 'boring-avatars';
export default function AvatarFunc ({size,address}){
    return <Avatar
        size={size}
        name={address}
        variant="pixel"
        colors={['#4216FF', '#47FF98', '#F0AB3D', '#FF6047', '#F600FF']}
    />
}
