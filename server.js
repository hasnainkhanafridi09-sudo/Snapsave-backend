
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const ytdl = require('ytdl-core');
const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());
const PORT = process.env.PORT || 3000;

function detectPlatform(url){
  const u=url.toLowerCase();
  if(u.includes('tiktok')) return 'tiktok';
  if(u.includes('instagram')) return 'instagram';
  if(u.includes('facebook')||u.includes('fb.watch')) return 'facebook';
  if(u.includes('youtube')||u.includes('youtu.be')) return 'youtube';
  return 'unknown';
}

app.get('/', (req,res)=>{
  res.json({status:'online', message:'SnapSave ALL-IN-ONE Backend Running', supported:['tiktok','youtube','instagram','facebook']});
});

app.get('/api/platforms', (req,res)=>{
  res.json({platforms:['tiktok','youtube','instagram','facebook']});
});

app.post('/api/process', async (req,res)=>{
  const {url}=req.body;
  if(!url) return res.status(400).json({success:false, error:'URL required'});
  const platform=detectPlatform(url);
  console.log('[SnapSave]',platform,url);
  try{
    let result={};
    if(platform==='tiktok'){
      const api=await axios.get('https://www.tikwm.com/api/?url='+encodeURIComponent(url),{timeout:15000});
      result={title:api.data.data.title, thumbnail:api.data.data.cover, download_url:api.data.data.play, author:api.data.data.author?.nickname};
    } else if(platform==='youtube'){
      const info=await ytdl.getInfo(url);
      const format=ytdl.chooseFormat(info.formats,{quality:'18'});
      result={title:info.videoDetails.title, thumbnail:info.videoDetails.thumbnails.pop().url, download_url:format.url};
    } else if(platform==='instagram' || platform==='facebook'){
      try{
        const {instagramDl, facebookDl}=require('@bochilteam/scraper');
        if(platform==='instagram'){
          const data=await instagramDl(url);
          result={title:'Instagram Video', thumbnail:data[0].thumbnail, download_url:data[0].url};
        } else {
          const data=await facebookDl(url);
          result={title:'Facebook Video', thumbnail:data.thumbnail, download_url:data.result?.[0]?.url || data.video_hd};
        }
      } catch(e){
        result={title:platform+' video', download_url:null, note:'Add RapidAPI for 100% stability'};
      }
    } else {
      return res.json({success:false, error:'Platform not supported'});
    }
    res.json({success:true, platform, original_url:url, data:result});
  } catch(e){
    console.error(e.message);
    res.status(500).json({success:false, error:'Failed to process', details:e.message});
  }
});

app.listen(PORT,'0.0.0.0',()=>console.log('SnapSave running on '+PORT));
