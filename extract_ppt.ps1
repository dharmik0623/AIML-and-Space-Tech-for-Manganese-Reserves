$ppt = New-Object -ComObject PowerPoint.Application
$pptFile = "C:\Users\Dharmik\Desktop\AIML and Space Tech for Manganese Reserves & Shortfall Mitigation\sih_submission.ppt"
$pres = $ppt.Presentations.Open($pptFile, 1, 0, 0)
Write-Output ("TOTAL_SLIDES: " + $pres.Slides.Count)

for ($i = 1; $i -le $pres.Slides.Count; $i++) {
    $slide = $pres.Slides.Item($i)
    Write-Output ("`n===============================")
    Write-Output ("SLIDE " + $i)
    Write-Output ("===============================")
    for ($j = 1; $j -le $slide.Shapes.Count; $j++) {
        $shape = $slide.Shapes.Item($j)
        if ($shape.HasTextFrame) {
            if ($shape.TextFrame.HasText) {
                Write-Output $shape.TextFrame.TextRange.Text
            }
        }
        if ($shape.HasTable) {
            for ($r = 1; $r -le $shape.Table.Rows.Count; $r++) {
                $rowText = ""
                for ($c = 1; $c -le $shape.Table.Columns.Count; $c++) {
                    $rowText += $shape.Table.Cell($r, $c).Shape.TextFrame.TextRange.Text + " | "
                }
                Write-Output $rowText
            }
        }
    }
}
$pres.Close()
$ppt.Quit()
