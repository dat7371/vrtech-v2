<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('posts')->updateOrInsert(
            ['slug' => 'android-box-carlinkit-tbox-ambient-v2-vinfast-mpv7'],
            [
                'title' => 'Android Box Carlinkit TBOX AMBIENT V2 lắp thực tế trên VinFast MPV7',
                'excerpt' => 'Carlinkit TBOX AMBIENT V2 VRTECH Edition khi lắp trên xe điện VinFast MPV7 giúp màn hình zin có thêm hệ sinh thái Android, Vietmap Live, giải trí online, SIM 4G và trải nghiệm tiện hơn cho gia đình.',
                'content' => <<<'HTML'
<h2>VinFast MPV7 có nên lắp Android Box không?</h2>
<p>Với xe điện như <strong>VinFast MPV7</strong>, nhiều khách muốn giữ nguyên màn hình zin nhưng vẫn có thêm các tiện ích quen thuộc như bản đồ, YouTube, nghe nhạc, trợ lý giọng nói, chia đôi màn hình và kết nối internet riêng trên xe. Đây là lý do Android Box ô tô trở thành lựa chọn hợp lý nếu xe tương thích Apple CarPlay hoặc Android Auto.</p>

<p>Trong lần lắp thực tế này, VRTECH sử dụng <strong>Android Box Carlinkit TBOX AMBIENT V2 - VRTECH Edition</strong>. Đây là bản có thiết kế nổi bật, phù hợp khách muốn một Android Box vừa dùng ổn hằng ngày vừa có ngoại hình đẹp khi đặt trong khoang xe.</p>

<h2>Carlinkit TBOX AMBIENT V2 trên VinFast MPV7 dùng để làm gì?</h2>
<ul>
    <li><strong>Dẫn đường tiện hơn:</strong> có thể dùng Google Maps, Vietmap Live và các ứng dụng bản đồ quen thuộc.</li>
    <li><strong>Giải trí online:</strong> hỗ trợ xem video, nghe nhạc, dùng ứng dụng giải trí khi xe dừng an toàn.</li>
    <li><strong>SIM 4G và phát WiFi:</strong> giúp xe có kết nối internet riêng, không cần lúc nào cũng phát mạng từ điện thoại.</li>
    <li><strong>Chia đôi màn hình:</strong> thuận tiện khi vừa cần bản đồ vừa muốn mở thêm ứng dụng khác.</li>
    <li><strong>Trải nghiệm gọn:</strong> cắm là dùng, không phải thay màn hình zin hay can thiệp sâu vào nội thất xe.</li>
</ul>

<h2>Vì sao chọn bản AMBIENT V2 cho VinFast MPV7?</h2>
<p>AMBIENT V2 là bản phù hợp với khách ưu tiên sự cân bằng giữa hiệu năng, thẩm mỹ và trải nghiệm sử dụng hằng ngày. Thiết kế của sản phẩm nhìn hiện đại hơn các dòng box phổ thông, trong khi vẫn đáp ứng tốt các nhu cầu cơ bản của gia đình khi di chuyển.</p>

<p>Với VinFast MPV7, nhóm khách sử dụng thường cần một thiết bị ổn định cho nhiều người trong xe: người lái cần bản đồ và cảnh báo giao thông, hành khách cần giải trí, trẻ nhỏ cần nội dung xem khi đi xa. TBOX AMBIENT V2 đáp ứng nhóm nhu cầu đó mà không làm thay đổi cấu trúc màn hình nguyên bản.</p>

<h2>Lắp Android Box cho VinFast MPV7 cần lưu ý gì?</h2>
<p>Trước khi chốt sản phẩm, nên kiểm tra đời xe, tình trạng màn hình và khả năng tương thích cổng kết nối. Không phải mọi xe đều có cùng cấu hình phần mềm, nên việc tư vấn trước theo xe là bước quan trọng để hạn chế lỗi không tương thích.</p>

<p>VRTECH thường kiểm tra trước nhu cầu của khách: dùng bản đồ nào, có cần SIM 4G không, có dùng Vietmap Live không, có cần cấu hình cao hơn không. Nếu nhu cầu chủ yếu là bản đồ, giải trí, chia đôi màn hình và kết nối 4G thì AMBIENT V2 là lựa chọn đáng cân nhắc.</p>

<h2>Ưu điểm khi mua Carlinkit AMBIENT V2 bản VRTECH Edition</h2>
<ul>
    <li>Sản phẩm Carlinkit V2 được tư vấn theo xe.</li>
    <li>Hỗ trợ cài đặt và hướng dẫn sử dụng các ứng dụng cần thiết.</li>
    <li>Có thể dùng kèm Vietmap Live cho nhu cầu dẫn đường và cảnh báo giao thông tại Việt Nam.</li>
    <li>Bảo hành điện tử và hỗ trợ kỹ thuật sau bán hàng.</li>
</ul>

<p>Nếu bạn đang dùng VinFast MPV7 và muốn nâng cấp màn hình zin theo hướng gọn, đẹp và tiện hơn, <strong>Carlinkit TBOX AMBIENT V2 VRTECH Edition</strong> là một lựa chọn phù hợp để bắt đầu.</p>
HTML,
                'cover_image' => 'images/products12thv2/ambientv2/TBOX AMBIENT 01.webp',
                'youtube_url' => 'https://www.tiktok.com/@vrtechofficial/video/7638880893582527751?is_from_webapp=1&sender_device=pc&web_id=7639667743511299604',
                'meta_title' => 'Android Box Carlinkit TBOX AMBIENT V2 cho VinFast MPV7 | VRTECH',
                'meta_description' => 'Lắp thực tế Android Box Carlinkit TBOX AMBIENT V2 VRTECH Edition trên xe điện VinFast MPV7: Vietmap Live, SIM 4G, giải trí, chia đôi màn hình và bảo hành điện tử.',
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
            ->where('slug', 'android-box-carlinkit-tbox-ambient-v2-vinfast-mpv7')
            ->delete();
    }
};
