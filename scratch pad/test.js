function normalizeText(newString){
  newString = newString.replace(/[\u0300-\u036f\u0489]/g, ''); //?
  newString = newString.replace(/[\u200B-\u200F\uFEFF\u202A-\u202E\u2060-\u206F]/g, ''); //?
  newString = newString.replace(/[\s\uFEFF\xA0]+/g, ''); //?
  newString = newString.normalize("NFC"); //?
  newString = newString.toUpperCase(); //?
  return  newString
}

normalizeText('t̶̨̢̛͉̦̬̯͕̯͔̫͂̆̍̍̄͆͗̋͛̈́̌̐ȩ̸̛̛̘͉̲̻͇̞̖͎̣̠̞͍̘̲͊̾̌̾̀ş̷͉̘̺̫̈́̊̽̈nnASS      n t̵̪̜̥̟͎̊̇̈̓͐̒͑̾́̇̈́̈́͜') //?

normalizeText("") //?

async function hashStringSHA256(str) {
  // Encode the string into a Uint8Array
  const encoder = new TextEncoder(); //?
  const data = encoder.encode(str); //?

  // Hash the string using SHA-256
  const hashBuffer = await crypto.subtle.digest('SHA-256', data); //?

  // Convert the hash to a hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer)); //?
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); //?

  return hashHex; //?
}

// Example usage
hashStringSHA256("").then(hash => console.log(hash)); 

