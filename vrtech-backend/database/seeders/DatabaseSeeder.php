<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        if (env('ADMIN_EMAIL') && env('ADMIN_PASSWORD')) {
            User::firstOrCreate(
                ['email' => env('ADMIN_EMAIL')],
                [
                    'name' => env('ADMIN_NAME', 'VRTECH Admin'),
                    'password' => Hash::make(env('ADMIN_PASSWORD')),
                ]
            );
        }

        $androidBox = Category::updateOrCreate(
            ['slug' => 'android-box-carlinkit'],
            [
                'name' => 'Android Box Carlinkit',
                'description' => 'Các phiên bản TBOX V2 đang bán trên website VRTECH.',
                'sort_order' => 1,
                'status' => 'active',
            ]
        );

        $navigation = Category::updateOrCreate(
            ['slug' => 'ung-dung-dan-duong'],
            [
                'name' => 'Ứng dụng dẫn đường',
                'description' => 'Thẻ và ứng dụng hỗ trợ lái xe như Vietmap Live Pro.',
                'sort_order' => 2,
                'status' => 'active',
            ]
        );

        $products = [
            [
                'category_id' => $androidBox->id,
                'name' => 'Carlinkit TBOX S2A V2',
                'slug' => 'tbox-s2a-v2',
                'sku' => 'TBOX-S2A-V2',
                'short_description' => 'Bản tiêu chuẩn cho nhu cầu CarPlay, Android Auto, giải trí và ứng dụng cơ bản.',
                'description' => 'Android Box Carlinkit V2 bản tiêu chuẩn, phù hợp khách cần cấu hình ổn định và chi phí hợp lý.',
                'price' => 3850000,
                'sale_price' => 3272500,
                'cpu' => 'Qualcomm 8 nhân',
                'ram' => '4GB',
                'rom' => '64GB',
                'os' => 'Android',
                'main_image' => 'images/products12thv2/s2av2/TBOX S2A 01.webp',
            ],
            [
                'category_id' => $androidBox->id,
                'name' => 'Carlinkit TBOX S2P V2',
                'slug' => 'tbox-s2p-v2',
                'sku' => 'TBOX-S2P-V2',
                'short_description' => 'Phiên bản bán chạy cho khách cần hiệu năng tốt, xem YouTube, bản đồ và app giải trí.',
                'description' => 'TBOX S2P V2 là lựa chọn cân bằng giữa hiệu năng, giá và trải nghiệm sử dụng hằng ngày.',
                'price' => 4350000,
                'sale_price' => 3697500,
                'cpu' => 'Qualcomm 8 nhân',
                'ram' => '4GB',
                'rom' => '64GB',
                'os' => 'Android',
                'main_image' => 'images/products12thv2/s2pv2/TBOX S2P 01.webp',
            ],
            [
                'category_id' => $androidBox->id,
                'name' => 'Carlinkit TBOX PLUS V2',
                'slug' => 'tbox-plus-v2',
                'sku' => 'TBOX-PLUS-V2',
                'short_description' => 'Bản nâng cấp hợp lý cho khách muốn bộ nhớ rộng và trải nghiệm mượt hơn.',
                'description' => 'TBOX PLUS V2 phù hợp nhóm khách cần cấu hình cao hơn bản tiêu chuẩn và lưu trữ rộng hơn.',
                'price' => 4300000,
                'sale_price' => 3655000,
                'cpu' => 'Qualcomm 8 nhân',
                'ram' => '8GB',
                'rom' => '128GB',
                'os' => 'Android',
                'main_image' => 'images/products12thv2/plusv2/TBOX PLUS 01.webp',
            ],
            [
                'category_id' => $androidBox->id,
                'name' => 'Carlinkit TBOX AMBIENT V2',
                'slug' => 'tbox-ambient-v2',
                'sku' => 'TBOX-AMBIENT-V2',
                'short_description' => 'Phiên bản thẩm mỹ cao cấp, phù hợp khách thích thiết kế nổi bật trong khoang xe.',
                'description' => 'TBOX AMBIENT V2 kết hợp hiệu năng Android Box và thiết kế cao cấp cho trải nghiệm nổi bật.',
                'price' => 4350000,
                'sale_price' => 3697500,
                'cpu' => 'Qualcomm 8 nhân',
                'ram' => '8GB',
                'rom' => '128GB',
                'os' => 'Android',
                'main_image' => 'images/products12thv2/ambientv2/TBOX AMBIENT 01.webp',
            ],
            [
                'category_id' => $androidBox->id,
                'name' => 'Carlinkit ULTRA MAX V2',
                'slug' => 'tbox-ultra-max-v2',
                'sku' => 'TBOX-ULTRA-MAX-V2',
                'short_description' => 'Bản hiệu năng mạnh nhất cho khách cần trải nghiệm mượt, đa nhiệm và cấu hình cao.',
                'description' => 'ULTRA MAX V2 là phiên bản cao cấp nhất trong dải Carlinkit TBOX V2 của VRTECH.',
                'price' => 6200000,
                'sale_price' => 5270000,
                'cpu' => 'Qualcomm 8 nhân',
                'ram' => '8GB',
                'rom' => '128GB',
                'os' => 'Android',
                'main_image' => 'images/products12thv2/ultrav2/TBOX ULTRA MAX 01.webp',
            ],
            [
                'category_id' => $navigation->id,
                'name' => 'Vietmap Live Pro 2026',
                'slug' => 'vietmap-live-pro-2026',
                'sku' => 'VIETMAP-LIVE-PRO-2026',
                'short_description' => 'Thẻ Vietmap Live Pro chính hãng, cảnh báo tốc độ, camera phạt nguội và dữ liệu giao thông Việt Nam.',
                'description' => 'Vietmap Live Pro hỗ trợ dẫn đường, cảnh báo tốc độ, camera phạt nguội và dữ liệu giao thông cho tài xế Việt.',
                'price' => 480000,
                'sale_price' => null,
                'cpu' => null,
                'ram' => null,
                'rom' => null,
                'os' => 'Android / iOS / Android Box',
                'main_image' => 'images/vietmap/vietmap 01.webp',
            ],
        ];

        foreach ($products as $product) {
            Product::updateOrCreate(
                ['slug' => $product['slug']],
                $product + [
                    'warranty_months' => 12,
                    'status' => 'active',
                ]
            );
        }
    }
}
