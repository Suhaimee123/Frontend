export const base64ToFile = (base64String: string, fileName: string): File => {
    const byteCharacters = atob(base64String);
    const byteNumbers = Array.from({ length: byteCharacters.length }, (_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    return new File([byteArray], fileName, { type: 'image/jpeg' }); // Adjust the type if necessary
};
