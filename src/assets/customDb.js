import { reactive } from "vue";

const customData = reactive({
    yes: 160000,
    getting_close: 130000,
    keep_going: 90000,
    avg_yes: 160000,
    avg_getting_close: 130000,
    avg_keep_going: 90000,
});

// Function to update customData
const updateCustomData = (key, value) => {
    if (customData.hasOwnProperty(key)) {
        customData[key] = value;
    } else {
        console.warn(`Key "${key}" does not exist in customData`);
    }
};

export { customData, updateCustomData };