<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('posts')->updateOrInsert(
            ['slug' => 'carlinkit-tbox-s2a-v2-de-tiep-can-cho-xe'],
            [
                'title' => 'Carlinkit TBOX S2A V2: bản dễ tiếp cận cho nhu cầu hằng ngày',
                'excerpt' => 'Carlinkit TBOX S2A V2 là lựa chọn dễ tiếp cận trong dòng Carlinkit V2 by VRTECH, nổi bật với LED RGB, Android 13, chip Qualcomm 6115, SIM 4G, phát WiFi, Kiki và chia đôi màn hình.',
                'content' => <<<'HTML'
<h2>Carlinkit TBOX S2A V2 là gì?</h2>
<p><strong>Carlinkit TBOX S2A V2</strong> là Android Box ô tô dành cho người muốn nâng cấp màn hình zin theo hướng đơn giản, dễ dùng và chi phí dễ tiếp cận. Thiết bị giúp xe có thêm hệ sinh thái Android để dùng bản đồ, nghe nhạc, xem nội dung giải trí, kết nối SIM 4G và phát WiFi ngay trên xe.</p>

<p>Điểm đáng chú ý của bản S2A V2 không chỉ nằm ở cấu hình đủ dùng, mà còn ở thiết kế có <strong>LED RGB</strong>. Khi đặt trong khoang xe, sản phẩm nhìn nổi bật hơn nhiều so với một Android Box phổ thông.</p>

<h2>Những điểm nổi bật của TBOX S2A V2</h2>
<ul>
    <li><strong>LED RGB nổi bật:</strong> tạo cảm giác hiện đại hơn khi đặt trong xe.</li>
    <li><strong>Android 13:</strong> giao diện quen thuộc, dễ cài thêm ứng dụng cần thiết.</li>
    <li><strong>Chip Qualcomm 6115:</strong> đáp ứng tốt nhu cầu cơ bản hằng ngày như bản đồ, nghe nhạc, YouTube và các ứng dụng giải trí phổ biến.</li>
    <li><strong>SIM 4G và phát WiFi:</strong> giúp xe có kết nối internet riêng, tiện hơn khi đi xa hoặc không muốn phụ thuộc vào điện thoại.</li>
    <li><strong>Kiki và chia đôi màn hình:</strong> hỗ trợ thao tác rảnh tay và dùng song song nhiều nhu cầu trên màn hình xe.</li>
</ul>

<h2>S2A V2 phù hợp với ai?</h2>
<p>Bản này phù hợp với khách muốn dùng Android Box ô tô chính ngạch nhưng chưa cần cấu hình quá cao. Nếu nhu cầu chính là dẫn đường, nghe nhạc, xem YouTube, dùng trợ lý giọng nói và kết nối 4G ổn định, S2A V2 là lựa chọn hợp lý để bắt đầu.</p>

<p>Nếu bạn cần đa nhiệm nhiều hơn, lưu nhiều ứng dụng hơn hoặc muốn cấu hình mạnh hơn, có thể cân nhắc các bản cao hơn như S2P V2, PLUS V2, AMBIENT V2 hoặc ULTRA MAX V2. Tuy vậy, với nhu cầu phổ thông hằng ngày, S2A V2 vẫn là bản dễ chọn nhất trong dòng Carlinkit V2.</p>

<h2>Ưu đãi khi mua Carlinkit S2A V2 tại VRTECH</h2>
<ul>
    <li>Tặng YouTube Premium theo chương trình bán hàng.</li>
    <li>Trợ giá Vietmap Live cho khách cần dẫn đường và cảnh báo giao thông tại Việt Nam.</li>
    <li>Khi mua trên phiên livestream có thể được tặng SIM 4G và tháng đầu sử dụng theo chương trình đang chạy.</li>
</ul>

<h2>Vì sao nên chọn bản VRTECH?</h2>
<p>Khi mua Carlinkit TBOX S2A V2 tại VRTECH, khách hàng có thêm lợi thế về tư vấn tương thích theo xe, chính sách bảo hành điện tử, hỗ trợ kỹ thuật và thông tin sản phẩm rõ ràng. Đây là điểm quan trọng với Android Box ô tô, vì không phải xe nào cũng có cùng cách kết nối và thói quen sử dụng.</p>

<p>Nếu bạn đang tìm một Android Box ô tô dễ tiếp cận, có 4G, có thiết kế nổi bật và đáp ứng tốt nhu cầu hằng ngày, <strong>Carlinkit TBOX S2A V2 by VRTECH</strong> là một lựa chọn đáng cân nhắc.</p>
HTML,
                'cover_image' => 'images/products12thv2/s2av2/TBOX S2A 01.webp',
                'youtube_url' => 'https://www.tiktok.com/@vrtechofficial/video/7634056172189912327?is_from_webapp=1&sender_device=pc&web_id=7639667743511299604',
                'meta_title' => 'Carlinkit TBOX S2A V2 by VRTECH | Android Box ô tô dễ tiếp cận',
                'meta_description' => 'Giới thiệu Carlinkit TBOX S2A V2 by VRTECH: LED RGB, Android 13, chip Qualcomm 6115, SIM 4G, phát WiFi, Kiki, chia đôi màn hình và ưu đãi livestream.',
                'status' => 'published',
                'published_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
    }

    public function down(): void
    {
        DB::table('posts')
            ->where('slug', 'carlinkit-tbox-s2a-v2-de-tiep-can-cho-xe')
            ->delete();
    }
};
