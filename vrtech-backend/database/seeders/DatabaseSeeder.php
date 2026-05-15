<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Customer;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        if (env('ADMIN_EMAIL') && env('ADMIN_PASSWORD')) {
            User::updateOrCreate(
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
                'name' => 'Carlinkit TBOX S2A V2 2026',
                'slug' => 'tbox-s2a-v2',
                'sku' => 'TBOX-S2A-V2',
                'short_description' => 'Chip Qualcomm 6115, Apple CarPlay và Android Auto cho nhu cầu sử dụng hằng ngày.',
                'description' => 'Phiên bản Android Box Ô Tô tối ưu cho nhu cầu hằng ngày, giữ nguyên zin màn hình xe và đáp ứng tốt giải trí, dẫn đường, kết nối thông minh.',
                'price' => 3850000,
                'sale_price' => 3272500,
                'cpu' => 'Qualcomm 6115',
                'ram' => '4GB',
                'rom' => '64GB',
                'os' => 'Android',
                'main_image' => 'images/products12thv2/s2av2/TBOX S2A 01.webp',
                'variants' => [
                    ['label' => 'RAM 4GB / ROM 64GB', 'sku' => 'TBOX-S2A-V2-4-64', 'price' => 3850000, 'sale_price' => 3272500, 'ram' => '4GB', 'rom' => '64GB', 'badge' => 'Bản tiêu chuẩn'],
                    ['label' => 'RAM 8GB / ROM 128GB', 'sku' => 'TBOX-S2A-V2-8-128', 'price' => 4850000, 'sale_price' => 4122500, 'ram' => '8GB', 'rom' => '128GB', 'badge' => 'Bộ nhớ cao hơn'],
                ],
            ],
            [
                'category_id' => $androidBox->id,
                'name' => 'Carlinkit TBOX S2P V2 2026',
                'slug' => 'tbox-s2p-v2',
                'sku' => 'TBOX-S2P-V2',
                'short_description' => 'Chip Qualcomm 6225, Apple CarPlay và Android Auto, bản bán chạy nhất trong hệ Carlinkit V2.',
                'description' => 'Bản bán chạy nhất trong hệ Carlinkit V2, cân bằng giữa hiệu năng Qualcomm 6225, độ ổn định và chi phí; phù hợp giải trí, dẫn đường và kết nối hằng ngày.',
                'price' => 4350000,
                'sale_price' => 3697500,
                'cpu' => 'Qualcomm 6225',
                'ram' => '4GB',
                'rom' => '64GB',
                'os' => 'Android',
                'main_image' => 'images/products12thv2/s2pv2/TBOX S2P 01.webp',
                'variants' => [
                    ['label' => 'RAM 4GB / ROM 64GB', 'sku' => 'TBOX-S2P-V2-4-64', 'price' => 4350000, 'sale_price' => 3697500, 'ram' => '4GB', 'rom' => '64GB', 'badge' => 'Bản tiêu chuẩn'],
                    ['label' => 'RAM 8GB / ROM 128GB', 'sku' => 'TBOX-S2P-V2-8-128', 'price' => 5350000, 'sale_price' => 4547500, 'ram' => '8GB', 'rom' => '128GB', 'badge' => 'Bộ nhớ cao hơn'],
                ],
            ],
            [
                'category_id' => $androidBox->id,
                'name' => 'Carlinkit TBOX PLUS V2 2026',
                'slug' => 'tbox-plus-v2',
                'sku' => 'TBOX-PLUS-V2',
                'short_description' => 'Chip Qualcomm 6125, bản nâng cấp hợp lý cho nhu cầu mượt hơn và dùng hằng ngày.',
                'description' => 'TBOX PLUS V2 - VRTECH Edition là giải pháp nâng cấp toàn diện giúp biến màn hình zin của xe thành một hệ điều hành Android hoàn chỉnh, ổn định và dễ sử dụng trong nhu cầu hằng ngày.',
                'price' => 4300000,
                'sale_price' => 3655000,
                'cpu' => 'Qualcomm 6125',
                'ram' => '6GB',
                'rom' => '64GB',
                'os' => 'Android',
                'main_image' => 'images/products12thv2/plusv2/TBOX PLUS 01.webp',
                'variants' => [
                    ['label' => 'RAM 6GB / ROM 64GB', 'sku' => 'TBOX-PLUS-V2-6-64', 'price' => 4300000, 'sale_price' => 3655000, 'ram' => '6GB', 'rom' => '64GB', 'badge' => 'Bản tiêu chuẩn'],
                    ['label' => 'RAM 8GB / ROM 128GB', 'sku' => 'TBOX-PLUS-V2-8-128', 'price' => 5300000, 'sale_price' => 4505000, 'ram' => '8GB', 'rom' => '128GB', 'badge' => 'Bộ nhớ cao hơn'],
                ],
            ],
            [
                'category_id' => $androidBox->id,
                'name' => 'Carlinkit TBOX AMBIENT V2 2026',
                'slug' => 'tbox-ambient-v2',
                'sku' => 'TBOX-AMBIENT-V2',
                'short_description' => 'Chip Qualcomm 6225, phiên bản thẩm mỹ cao cấp với hiệu năng ổn định.',
                'description' => 'Phiên bản Android Box ô tô cân bằng tốt giữa hiệu năng, thẩm mỹ và giá thành, phù hợp người dùng cần box ổn định, có 4G, giải trí, dẫn đường và quản lý qua app.',
                'price' => 4350000,
                'sale_price' => 3697500,
                'cpu' => 'Qualcomm 6225',
                'ram' => '4GB',
                'rom' => '64GB',
                'os' => 'Android',
                'main_image' => 'images/products12thv2/ambientv2/TBOX AMBIENT 01.webp',
                'variants' => [
                    ['label' => 'RAM 4GB / ROM 64GB', 'sku' => 'TBOX-AMBIENT-V2-4-64', 'price' => 4350000, 'sale_price' => 3697500, 'ram' => '4GB', 'rom' => '64GB', 'badge' => 'Bản tiêu chuẩn'],
                    ['label' => 'RAM 8GB / ROM 128GB', 'sku' => 'TBOX-AMBIENT-V2-8-128', 'price' => 5350000, 'sale_price' => 4547500, 'ram' => '8GB', 'rom' => '128GB', 'badge' => 'Bộ nhớ cao hơn'],
                ],
            ],
            [
                'category_id' => $androidBox->id,
                'name' => 'Carlinkit TBOX ULTRA MAX V2 2026',
                'slug' => 'tbox-ultra-max-v2',
                'sku' => 'TBOX-ULTRA-MAX-V2',
                'short_description' => 'Chip Qualcomm SM6350, bản flagship mạnh nhất dòng V2.',
                'description' => 'TBOX ULTRA MAX V2 - VRTECH Edition 2026 là bản flagship mạnh nhất dòng V2 với chip Snapdragon 690, Android 15, WiFi 6, VRTECH Nexus và bảo hành điện tử 12 tháng.',
                'price' => 6200000,
                'sale_price' => 5270000,
                'cpu' => 'Qualcomm SM6350',
                'ram' => '8GB',
                'rom' => '128GB',
                'os' => 'Android',
                'main_image' => 'images/products12thv2/ultrav2/TBOX ULTRA MAX 01.webp',
                'variants' => [
                    ['label' => 'RAM 8GB / ROM 128GB', 'sku' => 'TBOX-ULTRA-MAX-V2-8-128', 'price' => 6200000, 'sale_price' => 5270000, 'ram' => '8GB', 'rom' => '128GB', 'badge' => 'Cấu hình duy nhất'],
                ],
            ],
            [
                'category_id' => $navigation->id,
                'name' => 'Vietmap Live Pro 2026',
                'slug' => 'vietmap-live-pro-2026',
                'sku' => 'VIETMAP-LIVE-PRO-2026',
                'short_description' => 'Cảnh báo tốc độ, camera phạt nguội và dữ liệu giao thông Việt Nam.',
                'description' => 'Ứng dụng trợ lý giao thông cho ô tô dành riêng cho tài xế Việt, dùng trên điện thoại, Android Box và màn hình ô tô.',
                'price' => 480000,
                'sale_price' => null,
                'cpu' => null,
                'ram' => null,
                'rom' => null,
                'os' => 'Android / iOS / Android Box',
                'main_image' => 'images/vietmap/vietmap 01.webp',
                'variants' => [
                    ['label' => 'Vietmap Live Pro 1 năm', 'sku' => 'VIETMAP-LIVE-PRO-1Y', 'price' => 480000, 'sale_price' => null, 'ram' => null, 'rom' => null, 'badge' => 'Gói 1 năm'],
                    ['label' => 'Vietmap Live Pro 2 năm', 'sku' => 'VIETMAP-LIVE-PRO-2Y', 'price' => 760000, 'sale_price' => null, 'ram' => null, 'rom' => null, 'badge' => 'Gói 2 năm'],
                ],
            ],
        ];

        foreach ($products as $product) {
            $variants = $product['variants'];
            unset($product['variants']);

            $storedProduct = Product::updateOrCreate(
                ['slug' => $product['slug']],
                $product + [
                    'warranty_months' => 12,
                    'status' => 'active',
                ]
            );

            foreach ($variants as $index => $variant) {
                ProductVariant::updateOrCreate(
                    ['sku' => $variant['sku']],
                    $variant + [
                        'product_id' => $storedProduct->id,
                        'sort_order' => $index,
                        'status' => 'active',
                    ]
                );
            }
        }

        if (! app()->environment('production') || env('SEED_TEST_DATA', false)) {
            $testWarranties = [
                [
                    'customer' => ['name' => 'Nguyen Van A', 'phone' => '0909123456', 'car_model' => 'Mazda 3'],
                    'product_slug' => 'tbox-s2p-v2',
                    'serial_number' => 'VRTECH-S2P-000001',
                    'purchase_date' => '2026-05-04',
                    'activated_at' => '2026-05-04',
                    'status' => 'active',
                    'note' => 'Du lieu test tra cuu bao hanh.',
                ],
                [
                    'customer' => ['name' => 'Tran Thi B', 'phone' => '0909234567', 'car_model' => 'Toyota Vios'],
                    'product_slug' => 'tbox-s2a-v2',
                    'serial_number' => 'VRTECH-S2A-000002',
                    'purchase_date' => '2026-05-02',
                    'activated_at' => '2026-05-02',
                    'status' => 'active',
                    'note' => 'Test serial 6 so cho S2A.',
                ],
                [
                    'customer' => ['name' => 'Le Minh C', 'phone' => '0909345678', 'car_model' => 'Honda CR-V'],
                    'product_slug' => 'tbox-plus-v2',
                    'serial_number' => 'VRTECH-PLUS-000003',
                    'purchase_date' => '2026-04-25',
                    'activated_at' => '2026-04-25',
                    'status' => 'active',
                    'note' => 'Test bao hanh TBOX PLUS V2.',
                ],
                [
                    'customer' => ['name' => 'Pham Hoang D', 'phone' => '0909456789', 'car_model' => 'Ford Everest'],
                    'product_slug' => 'tbox-ambient-v2',
                    'serial_number' => 'VRTECH-AMB-000004',
                    'purchase_date' => '2026-04-18',
                    'activated_at' => '2026-04-18',
                    'status' => 'active',
                    'note' => 'Test bao hanh TBOX AMBIENT V2.',
                ],
                [
                    'customer' => ['name' => 'Hoang Gia E', 'phone' => '0909567890', 'car_model' => 'Kia Carnival'],
                    'product_slug' => 'tbox-ultra-max-v2',
                    'serial_number' => 'VRTECH-ULTRA-000005',
                    'purchase_date' => '2026-03-20',
                    'activated_at' => '2026-03-20',
                    'status' => 'active',
                    'note' => 'Test bao hanh flagship Ultra Max.',
                ],
                [
                    'customer' => ['name' => 'Expired Test', 'phone' => '0909678901', 'car_model' => 'Hyundai Accent'],
                    'product_slug' => 'tbox-s2p-v2',
                    'serial_number' => 'VRTECH-S2P-000006',
                    'purchase_date' => '2024-01-15',
                    'activated_at' => '2024-01-15',
                    'expired_at' => '2025-01-15',
                    'status' => 'expired',
                    'note' => 'Du lieu test trang thai het han.',
                ],
            ];

            foreach ($testWarranties as $item) {
                $customer = Customer::updateOrCreate(
                    ['phone' => $item['customer']['phone']],
                    $item['customer']
                );
                $product = Product::where('slug', $item['product_slug'])->first();

                if (! $product) {
                    continue;
                }

                $activatedAt = \Illuminate\Support\Carbon::parse($item['activated_at']);

                \App\Models\Warranty::updateOrCreate(
                    ['serial_number' => $item['serial_number']],
                    [
                        'customer_id' => $customer->id,
                        'product_id' => $product->id,
                        'purchase_date' => $item['purchase_date'],
                        'activated_at' => $activatedAt,
                        'expired_at' => $item['expired_at'] ?? $activatedAt->copy()->addMonths((int) $product->warranty_months)->toDateString(),
                        'status' => $item['status'],
                        'note' => $item['note'],
                    ]
                );
            }
        }
    }
}
