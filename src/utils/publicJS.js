const AddressToShow = (address) => {
    let frontStr = address.substring(0, 5);
    let afterStr = address.substring(address.length - 5, address.length);
    return `${frontStr}...${afterStr}`
}


const randomSort = (arr) =>{
    const newArr = [...arr]
    const length = newArr.length
    for (let i = 0; i < length; i++) {
        const index = Math.floor(Math.random() * length);
        let temp;
        temp = newArr[index]
        newArr[index] = newArr[i]
        newArr[i] = temp
    }
    return newArr;
}


export default {
    AddressToShow,
    randomSort
}