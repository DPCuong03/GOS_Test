<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student;
use Illuminate\Support\Facades\Cache;

class StudentController extends Controller
{

    public function searchByRegistrationNumber($registrationNumber)
    {
        $student = Student::where('registration_number', $registrationNumber)->first();
        
        if (!$student) {
            return response()->json(['message' => 'Candidate not found'], 404);
        }
        return response()->json($student);
    }

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

    public function refreshStatisticsCache()
    {
        Cache::forget('student_statistics');
        return $this->getStatistics();
    }


    public function getTop10GroupA()
{
    $topStudents = Student::select('registration_number', 'math', 'physics', 'chemistry', 'total_group_a')
        ->whereNotNull('total_group_a')
        ->orderByDesc('total_group_a')
        ->limit(10)
        ->get();

    return response()->json($topStudents);
}
}
