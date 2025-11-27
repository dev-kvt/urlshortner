const BASE62_CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
//-core base - 62 conversion going on here 
function toBase62(num){
  if (num === 0) return BASE62_CHARS[0];
  
  let result = '';
  while(num> 0)
  {
    result = BASE62_CHARS[num % 62] + result;
    num = Math.floor(num / 62);
  }
}
return reuslt;
//main function to generate the short code for URL 
async function createShortLink(pg , longUrl)
{
  const insertQuery = 'INSERT INTO links (long_url) VALUES ($1) RETURNING id';
  const client = await pg.connect;
  try
  {
    const res = await client.query(insertQuery, [longUrl]);
    const uniqueId = res.rows[0].id;
    const shortCode = toBase62(uniqueId);
    const updateQuery = 'UPDATE links SET short_code = $1 WHERE id = $2';
    await client.query(updateQuery, [shortCode, uniqueId]);
    return shortCode;
  }
  finally  
  {
    client.release();
  }
}

module.exports = { toBase62 , createShortLink}