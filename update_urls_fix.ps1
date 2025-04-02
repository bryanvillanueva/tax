
# Script PowerShell para actualizar las URLs en los archivos de componentes

# Lista de correspondencia entre componentes y números de estrategia
$componentStrategyMap = @(
  @{ component = "DepreciationForm.js"; strategyNum = 1 },
  @{ component = "HireYourKids.js"; strategyNum = 2 },
  @{ component = "PrepaidExpensesForm.js"; strategyNum = 3 },
  @{ component = "AugustaRuleForm.js"; strategyNum = 4 },
  @{ component = "ReimbursmentOfPersonalForm.js"; strategyNum = 5 },
  @{ component = "CharitableRemainderForm.js"; strategyNum = 6 },
  @{ component = "HireYourFamily.js"; strategyNum = 7 },
  @{ component = "QualifiedOpportunityFunds.js"; strategyNum = 8 },
  @{ component = "HealthSavingsAccountForm.js"; strategyNum = 9 },
  @{ component = "LifetimeLearningCredit.js"; strategyNum = 10 },
  @{ component = "SavingsPlanForm.js"; strategyNum = 11 },
  @{ component = "AccountableplanForm.js"; strategyNum = 12 },
  @{ component = "AdoptionIncentiveForm.js"; strategyNum = 13 },
  @{ component = "AmendedPriorYearForm.js"; strategyNum = 14 },
  @{ component = "ExemptionQualifiedSmallBusinessStockForm.js"; strategyNum = 15 },
  @{ component = "CostSegregationForm.js"; strategyNum = 16 },
  @{ component = "DeferredCapitalGainForm.js"; strategyNum = 17 },
  @{ component = "EducationAssistanceForm.js"; strategyNum = 18 },
  @{ component = "EducationTaxCreditForm.js"; strategyNum = 19 },
  @{ component = "HealthReimbursementArragementForm.js"; strategyNum = 20 },
  @{ component = "IncomeShiftingForm.js"; strategyNum = 21 },
  @{ component = "LifeInsuranceForm.js"; strategyNum = 22 },
  @{ component = "MaximizeMiscellaneousExpensesForm.js"; strategyNum = 23 },
  @{ component = "MealsDeductionForm.js"; strategyNum = 24 },
  @{ component = "NetOperatingLossesForm.js"; strategyNum = 25 },
  @{ component = "Solo401kForm.js"; strategyNum = 26 },
  @{ component = "ResearchAndDevelopmentCreditForm.js"; strategyNum = 27 },
  @{ component = "RothIRAForm.js"; strategyNum = 28 },
  @{ component = "HealthInsuranceDeductionForm2.js"; strategyNum = 29 },
  @{ component = "SEPContributionsForm.js"; strategyNum = 30 },
  @{ component = "SimpleIRAForm.js"; strategyNum = 31 },
  @{ component = "StartupCostOptimizationForm.js"; strategyNum = 32 },
  @{ component = "StateTaxSavingsForm.js"; strategyNum = 33 },
  @{ component = "TraditionalIRAContributionsForm.js"; strategyNum = 34 },
  @{ component = "UnreimbursedPartnershipExpensesForm.js"; strategyNum = 35 },
  @{ component = "ActiveRealEstateForm.js"; strategyNum = 36 },
  @{ component = "BackdoorRothForm.js"; strategyNum = 37 },
  @{ component = "CancellationByInsolvencyForm.js"; strategyNum = 38 },
  @{ component = "CharitableDonationOfAppreciatedAssetsForm.js"; strategyNum = 39 },
  @{ component = "InfluencerOptimizationForm.js"; strategyNum = 40 },
  @{ component = "COVULForm.js"; strategyNum = 41 },
  @{ component = "DepletionDeductionForm.js"; strategyNum = 42 },
  @{ component = "QualifiedDividendsForm.js"; strategyNum = 43 },
  @{ component = "DonorAdvisedFundForm.js"; strategyNum = 44 },
  @{ component = "ElectricVehicleCreditsForm.js"; strategyNum = 45 },
  @{ component = "ESOPForm.js"; strategyNum = 46 },
  @{ component = "FederalSolarInvestmentTaxCreditForm.js"; strategyNum = 47 },
  @{ component = "FinancedInsuranceForm.js"; strategyNum = 48 },
  @{ component = "FinancedSoftwareLeasebackForm.js"; strategyNum = 49 },
  @{ component = "ForeignEarnedIncomeExclusionForm.js"; strategyNum = 50 }
)

# Ruta al directorio de componentes
$componentsDir = "C:\wamp64\www\tax\src\components"

# Patrón de búsqueda para la URL original
$originalUrlPattern = 'href="https://tax.bryanglen.com/data/Strategies-Structure.pdf"'

# Contadores para seguimiento
$updatedFiles = 0
$failedFiles = 0
$notFoundFiles = 0

# Procesar cada componente
foreach ($item in $componentStrategyMap) {
  $component = $item.component
  $strategyNum = $item.strategyNum
  $filePath = Join-Path -Path $componentsDir -ChildPath $component
  
  # Verificar si el archivo existe
  if (-not (Test-Path $filePath)) {
    Write-Host "Archivo no encontrado: $component" -ForegroundColor Yellow
    $notFoundFiles++
    continue
  }
  
  try {
    # Leer el contenido del archivo
    $content = Get-Content -Path $filePath -Raw
    
    # Si el archivo contiene la URL original
    if ($content -match $originalUrlPattern) {
      # Reemplazar la URL con la nueva
      $newContent = $content -replace $originalUrlPattern, "href=`"https://cmltaxplanning.com/docs/S$strategyNum.pdf`""
      
      # Escribir el contenido actualizado de vuelta al archivo
      Set-Content -Path $filePath -Value $newContent
      
      Write-Host "Actualizado: $component -> S$strategyNum.pdf" -ForegroundColor Green
      $updatedFiles++
    } else {
      Write-Host "No se encontró la URL en: $component" -ForegroundColor Yellow
      $notFoundFiles++
    }
  } catch {
    Write-Host "Error al procesar $component: $($_.Exception.Message)" -ForegroundColor Red
    $failedFiles++
  }
}

# Mostrar resumen
Write-Host "`nResumen:" -ForegroundColor Cyan
Write-Host "Archivos actualizados: $updatedFiles" -ForegroundColor Green
Write-Host "Archivos con errores: $failedFiles" -ForegroundColor Red
Write-Host "URL no encontrada: $notFoundFiles" -ForegroundColor Yellow
