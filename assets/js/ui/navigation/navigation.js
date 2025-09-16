export function selectItem(index, arr) {
    for (let i = 0; i < arr.length; i++) {
        const div = arr[i];
        if (i === index) {
            div.classList.add('selected');
        } else {
            div.classList.remove('selected');
        }
    }
}