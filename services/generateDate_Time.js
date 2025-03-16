

export const generateDateTime = ()=>{
   const date = new Date()
   const day = date.getDate();
   const month = date.getMonth() + 1;
   const year = date.getFullYear();
   const time = date.toLocaleTimeString();

   return  year + "/" + month + "/" + day + " || " +   time ; // 2024/9/17 || 12:47:25 PM
   // return  date.toDateString();                     // Tue Sep 17 2024
   // return  date.toLocaleString('ar-EG');   // ١٧/٠٩/٢٠٢٤، ١٢:٢٩:١٩ م
   // return  date.toLocaleTimeString()                // 12:32:51 PM
}

