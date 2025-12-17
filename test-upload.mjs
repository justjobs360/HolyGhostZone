
import fs from 'fs';
import path from 'path';

async function testUpload() {
    // Create a dummy image buffer (minimal 1x1 GIF)
    const buffer = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
    const blob = new Blob([buffer], { type: 'image/gif' });
    const formData = new FormData();
    formData.append('file', blob, 'test-image.gif');

    console.log('Uploading image...');
    try {
        const res = await fetch('http://localhost:3000/api/admin/upload', {
            method: 'POST',
            body: formData,
        });

        if (!res.ok) {
            const txt = await res.text();
            console.error('Upload failed:', res.status, txt);
            return;
        }

        const data = await res.json();
        console.log('Upload success! URL:', data.url);

        console.log('Fetching image...');
        const imgRes = await fetch('http://localhost:3000' + data.url);

        if (imgRes.status === 200) {
            console.log('Image fetch success! Status:', imgRes.status);
            console.log('ContentType:', imgRes.headers.get('content-type'));
        } else {
            console.error('Image fetch failed:', imgRes.status);
        }

    } catch (err) {
        console.error('Test failed:', err);
    }
}

testUpload();
