<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student;
use Illuminate\Support\Facades\Cache;

class StudentController extends Controller
{
    // Task 1: Tra cứu điểm theo registration_number
    public function searchByRegistrationNumber($registrationNumber)
    {
        $student = Student::where('registration_number', $registrationNumber)->first();
        
        if (!$student) {
            return response()->json(['message' => 'Candidate not found'], 404);
        }
        return response()->json($student);
    }

    // Task 2: Thống kê 4 mức điểm (Dùng cho biểu đồ)
    public function getStatistics()
    {
        // Cache for 24 hours
        $report = Cache::remember('student_statistics', 24 * 60 * 60, function () {
            $subjects = ['math', 'literature', 'foreign_language', 'physics', 'chemistry', 'biology', 'history', 'geography', 'civic_education'];

            $selects = [];
            foreach ($subjects as $subject) {
                $selects[] = "SUM(CASE WHEN $subject >= 8 THEN 1 ELSE 0 END) as {$subject}_excellent";
                $selects[] = "SUM(CASE WHEN $subject BETWEEN 6 AND 7.99 THEN 1 ELSE 0 END) as {$subject}_good";
                $selects[] = "SUM(CASE WHEN $subject BETWEEN 4 AND 5.99 THEN 1 ELSE 0 END) as {$subject}_average";
                $selects[] = "SUM(CASE WHEN $subject < 4 THEN 1 ELSE 0 END) as {$subject}_below_average";
            }

            $data = Student::selectRaw(implode(', ', $selects))->first();

            $report = [];
            foreach ($subjects as $subject) {
                $report[$subject] = [
                    'excellent' => $data["{$subject}_excellent"],
                    'good' => $data["{$subject}_good"],
                    'average' => $data["{$subject}_average"],
                    'below_average' => $data["{$subject}_below_average"],
                ];
            }

            return $report;
        });

        return response()->json($report);
    }

    // Optional: Method to manually refresh the cache when data updates
    public function refreshStatisticsCache()
    {
        Cache::forget('student_statistics');
        return $this->getStatistics();
    }


    // Task 3: Top 10 khối A (Toán, Vật lí, Hóa học)
    public function getTop10GroupA()
{
    $topStudents = Student::select('registration_number', 'math', 'physics', 'chemistry', 'total_group_a')
        ->whereNotNull('total_group_a')
        ->orderByDesc('total_group_a') // Use indexed column!
        ->limit(10)
        ->get();

    return response()->json($topStudents);
}
}
