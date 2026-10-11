
from pathlib import Path
import subprocess
root=Path(__file__).resolve().parent
font='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
steps=[
('01  Vào phòng & sẵn sàng','Chọn nhân vật, gửi mã hoặc link phòng.\nMọi người sẵn sàng, chủ phòng bấm Bắt đầu.'),
('02  Gieo xúc xắc','Avatar lớn hơn cho biết người đang có lượt.\nBấm Gieo xúc xắc và chờ quân cờ di chuyển.'),
('03  Mua đất hoặc đấu giá','Đến ô đất chưa có chủ: mua hoặc mở đấu giá.\nBấm vào ô đất để xem giá, tiền thuê và chủ sở hữu.'),
('04  Xây nhà','Sở hữu đủ nhóm màu rồi xây nhà đồng đều.\nBấm ô đất của bạn để xem thao tác quản lý.'),
('05  Kết thúc lượt','Xử lý mua đất, tiền thuê hoặc khoản thuế.\nBấm Kết thúc lượt để chuyển sang người tiếp theo.')
]
filters=["drawbox=x=348:y=148:w=584:h=350:color=0xf0ead3:t=fill","drawbox=x=393:y=193:w=494:h=260:color=0x224949:t=fill"]
colors=['e29b87','dfc26b','90bbaa','7fa8ba','b993b8','a7b58d','ddaf85','d58d8e','84b49b']
for i in range(11):
    x=348+i*53
    for y in [148,455]:
        filters+= [f'drawbox=x={x}:y={y}:w=54:h=43:color=0x244844:t=1']
        if i not in [0,10]: filters+=[f'drawbox=x={x+2}:y={y+2}:w=50:h=7:color=0x{colors[i-1]}:t=fill']
for i in range(1,10):
    y=148+i*31
    for x in [348,879]:
        filters+=[f'drawbox=x={x}:y={y}:w=53:h=32:color=0x244844:t=1',f'drawbox=x={x+2}:y={y+2}:w=7:h=28:color=0x{colors[i-1]}:t=fill']
filters+=["drawbox=x=535:y=253:w=62:h=62:color=0xf4eedb:t=fill","drawbox=x=682:y=253:w=62:h=62:color=0xf4eedb:t=fill"]
for x,y in [(550,267),(570,292),(697,267),(713,281),(729,297)]:
    filters+=[f"drawtext=fontfile='{font}':text='•':x={x}:y={y}:fontsize=27:fontcolor=0x233e3b"]
for i in range(3):
    filters += [f'drawbox=x={525+i*80}:y=371:w=55:h=43:color=0xb7d0a3:t=fill',f'drawbox=x={521+i*80}:y=365:w=63:h=9:color=0xe4c590:t=fill',f'drawbox=x={548+i*80}:y=393:w=10:h=21:color=0x224949:t=fill']
filters += [f"drawtext=fontfile='{font}':text='CỜ TỶ PHÚ':fontsize=26:fontcolor=0xf1deaf:x=(w-tw)/2:y=208", f"drawtext=fontfile='{font}':text='●':fontsize=32:fontcolor=0xe9b2a2:x=350+mod(t*70\,550):y=455", f"drawtext=fontfile='{font}':text='HƯỚNG DẪN NHANH':fontsize=14:fontcolor=0xaac3b1:x=(w-tw)/2:y=25"]
vtt=['WEBVTT','']
for index,(title,description) in enumerate(steps):
    (root/f'title{index}.txt').write_text(title,encoding='utf-8')
    (root/f'body{index}.txt').write_text(description,encoding='utf-8')
    start=index*6
    enable=f"between(t,{start},{start+5.999})"
    filters += [f"drawtext=fontfile='{font}':textfile='{root}/title{index}.txt':fontsize=36:fontcolor=0xf4dfb1:x=(w-tw)/2:y=65:enable='{enable}'",
                f"drawtext=fontfile='{font}':textfile='{root}/body{index}.txt':fontsize=24:line_spacing=14:fontcolor=0xe5efda:x=(w-tw)/2:y=545:enable='{enable}'"]
    vtt += [f'00:00:{start:02d}.000 --> 00:00:{start+6:02d}.000', title, description,'']
    filters += [f"drawbox=x={220+index*170}:y=664:w=150:h=5:color=0xe8cd98:t=fill:enable='gte(t,{start})'"]
(root/'monopoly-guide.vtt').write_text('\n'.join(vtt),encoding='utf-8')
(root/'video.filter').write_text(','.join(filters),encoding='utf-8')
subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-f','lavfi','-i','color=c=0x112c31:s=1280x720:r=24:d=30','-filter_script:v',str(root/'video.filter'),'-c:v','libx264','-pix_fmt','yuv420p','-crf','23','-movflags','+faststart',str(root/'monopoly-guide.mp4')],check=True)
