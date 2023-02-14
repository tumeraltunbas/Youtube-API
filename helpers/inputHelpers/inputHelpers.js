export const validateInputs = (...inputs) => {
    for(var i of inputs)
    {
        if(!i)
        return false
    }
    return true;
}