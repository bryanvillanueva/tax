# Script PowerShell para actualizar las URLs en los archivos de componentes (estrategias S51-S102)

# Lista de correspondencia entre componentes y números de estrategia
$componentStrategyMap = @(
  @{ component = "GroupHealthInsuranceForm.js"; strategyNum = 51 },
  @{ component = "GroupingRelatedActivitiesForm.js"; strategyNum = 52 },
  @{ component = "HistoricalPreservationEasementForm.js"; strategyNum = 53 },
  @{ component = "HomeOfficeDeductionForm.js"; strategyNum = 54 },
  @{ component = "InstallmentSaleForm.js"; strategyNum = 55 },
  @{ component = "MaximizeItemizationForm .js"; strategyNum = 56 },  # Nota: tiene un espacio en el nombre
  @{ component = "NoncashCharitableContributionsForm .js"; strategyNum = 57 },  # Nota: tiene un espacio en el nombre
  @{ component = "OilAndGasDrillingCostForm.js"; strategyNum = 58 },
  @{ component = "OilAndGasMLPForm.js"; strategyNum = 59 },
  @{ component = "OrdinaryLossOnWorthlessStockForm.js"; strategyNum = 60 },
  @{ component = "PassThroughEntity.js"; strategyNum = 61 },
  @{ component = "PassiveLossAndPigs.js"; strategyNum = 62 },
  @{ component = "PrimarySaleExclusion.js"; strategyNum = 63 },
  @{ component = "PrivateFamilyFoundation.js"; strategyNum = 64 },
  @{ component = "QualifiedCharitableDistributions.js"; strategyNum = 65 },
  @{ component = "RealEstateDevelopmentCharitableOptionForm.js"; strategyNum = 66 },
  @{ component = "RestrictedStockUnitsForm.js"; strategyNum = 67 },
  @{ component = "RetireePlanningForm.js"; strategyNum = 68 },
  @{ component = "SCorpRevocationForm.js"; strategyNum = 69 },
  @{ component = "SecureAct20StrategiesForm.js"; strategyNum = 70 },
  @{ component = "SelfDirectedIRA401KForm.js"; strategyNum = 71 },
  # Las estrategias 71 y 72 apuntan al mismo componente
  @{ component = "SelfDirectedIRA401KForm.js"; strategyNum = 72 },
  @{ component = "ShortTermRentalForm.js"; strategyNum = 73 },
  @{ component = "SolarPassiveInvestmentForm.js"; strategyNum = 74 },
  @{ component = "BonusDepreciationForm.js"; strategyNum = 75 },
  @{ component = "StructuredInvestmentProgramForm.js"; strategyNum = 76 },
  @{ component = "TaxFreeIncomeForm.js"; strategyNum = 77 },
  @{ component = "WorkOpportunityTaxCreditForm.js"; strategyNum = 78 },
  @{ component = "ExchangeOnRealEstateForm.js"; strategyNum = 79 },
  @{ component = "DefinedBenefitPlanForm.js"; strategyNum = 80 },
  @{ component = "DayTraderTaxStatusForm.js"; strategyNum = 81 },
  @{ component = "CollegeStudentStrategiesForm.js"; strategyNum = 82 },
  @{ component = "SellHomeToSCorpForm.js"; strategyNum = 83 },
  @{ component = "GiftingStockStrategyForm.js"; strategyNum = 84 },  # Nota: podría ser RealEstateOptionsForm.js
  @{ component = "RealEstateOptionsForm.js"; strategyNum = 85 },  # Según FormSelector sería Employer Retirement Plan
  @{ component = "MarriedFilingSeparateForm.js"; strategyNum = 86 },
  @{ component = "IndividualPlanningIdeasForm.js"; strategyNum = 87 },
  @{ component = "NetInvestmentIncomeTaxForm.js"; strategyNum = 88 },
  @{ component = "MiscTaxCreditsForm.js"; strategyNum = 89 },
  @{ component = "RentalStrategies754ElectionForm.js"; strategyNum = 90 },
  @{ component = "ReasonableCompAnalysisForm.js"; strategyNum = 91 },
  @{ component = "RealEstateProfessionalForm.js"; strategyNum = 92 },
  @{ component = "CaptiveInsuranceForm.js"; strategyNum = 93 },
  @{ component = "CharitableLLCForm.js"; strategyNum = 94 },
  @{ component = "SoleProprietorForm.js"; strategyNum = 95 },
  @{ component = "ChoiceOfEntityForm.js"; strategyNum = 96 },
  @{ component = "ChoiceOfEntityCCorpForm.js"; strategyNum = 97 },
  @{ component = "ChoiceOfEntityPartnershipForm.js"; strategyNum = 98 },
  @{ component = "ChoiceOfEntitySCorpForm.js"; strategyNum = 99 },
  @{ component = "QbidStandardMethod.js"; strategyNum = 100 },  # QBID Simple/Standard Method
  # Nota: No hay estrategia 101 específica, la 100 y 101 apuntan a lo mismo
  @{ component = "HarvestingCryptoForm.js"; strategyNum = 102 }  # Harvesting for Crypto Investors
)

# Ruta al directorio de componentes
$componentsDir = "C:\wamp64\www\tax\src\components"

# Patrón de búsqueda para la URL original
$originalUrlPattern = 'href="https://tax.bryanglen.com/data/Strategies-Structure.pdf"'

# Contadores para seguimiento
$updatedFiles = 0
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
}

# Mostrar resumen
Write-Host "`nResumen:" -ForegroundColor Cyan
Write-Host "Archivos actualizados: $updatedFiles" -ForegroundColor Green
Write-Host "URL no encontrada/Archivos no encontrados: $notFoundFiles" -ForegroundColor Yellow
