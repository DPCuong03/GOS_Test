<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StudentSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // Tăng thời gian thực thi tối đa (vô hạn) để xử lý 1 triệu dòng
        set_time_limit(0);
        
        $filePath = storage_path('app/private/diem_thi_thpt_2024.csv');
        
        if (!file_exists($filePath)) {
            $this->command->error("Không tìm thấy file tại: " . $filePath);
            return;
        }

        // Xóa dữ liệu cũ trước khi nạp mới
        DB::table('students')->truncate();

        // Mở file dưới dạng stream để tiết kiệm RAM (không dùng file_get_contents)
        if (($handle = fopen($filePath, "r")) !== FALSE) {
            // Đọc dòng đầu tiên để lấy danh sách tiêu đề cột
            $header = fgetcsv($handle, 1000, ",");
            
            $this->command->info("Bắt đầu nạp dữ liệu (vui lòng đợi)...");

            // Bắt đầu Transaction để tăng tốc độ ghi vào DB
            DB::beginTransaction();
            
            $count = 0;
            while (($values = fgetcsv($handle, 1000, ",")) !== FALSE) {
                if (count($header) !== count($values)) continue;
                
                // Kết hợp header và values thành mảng associative
                $item = array_combine($header, $values);

                // Lấy điểm 3 môn khối A
                $math = is_numeric($item['toan']) ? (float)$item['toan'] : null;
                $physics = is_numeric($item['vat_li']) ? (float)$item['vat_li'] : null;
                $chemistry = is_numeric($item['hoa_hoc']) ? (float)$item['hoa_hoc'] : null;

                // Tính toán cột tổng điểm ngay tại đây
                $totalGroupA = ($math !== null && $physics !== null && $chemistry !== null) 
                    ? ($math + $physics + $chemistry) 
                    : null;

                DB::table('students')->insert([
                    'registration_number' => $item['sbd'],
                    'math'          => $math,
                    'literature'       => is_numeric($item['ngu_van']) ? (float)$item['ngu_van'] : null,
                    'foreign_language'     => is_numeric($item['ngoai_ngu']) ? (float)$item['ngoai_ngu'] : null,
                    'physics'        => $physics,
                    'chemistry'       => $chemistry,
                    'biology'      => is_numeric($item['sinh_hoc']) ? (float)$item['sinh_hoc'] : null,
                    'history'       => is_numeric($item['lich_su']) ? (float)$item['lich_su'] : null,
                    'geography'        => is_numeric($item['dia_li']) ? (float)$item['dia_li'] : null,
                    'civic_education'          => is_numeric($item['gdcd']) ? (float)$item['gdcd'] : null,
                    'foreign_language_code'  => $item['ma_ngoai_ngu'] ?: null,
                    'total_group_a' => $totalGroupA, // Cột đã được đánh Index trong Migration
                    'created_at'    => now(),
                    'updated_at'    => now(),
                ]);

                $count++;
                
                // Cứ 5000 dòng thì đẩy dữ liệu xuống ổ cứng một lần để tránh treo RAM
                if ($count % 5000 == 0) {
                    DB::commit();
                    DB::beginTransaction();
                    $this->command->comment("Đã nạp $count dòng...");
                }
            }
            
            DB::commit();
            fclose($handle);
            $this->command->info("Thành công! Đã nạp tổng cộng $count thí sinh.");
        }
    }
}