param location string
param staticWebAppSku string
param appServicePlanSku string
param appUrl string
param dbPrimaryRegion string
param dbSecondaryRegion string

var resourceToken = uniqueString(resourceGroup().id, location)

module swa 'br/public:avm/res/web/static-site:0.3.0' = {
  name: 'client'
  params: {
    name: 'Frontend-${resourceToken}'
    location: location
    sku: staticWebAppSku
  }
}

resource appServicePlan 'Microsoft.Web/serverfarms@2024-04-01' = {
  name: 'ASP-${resourceToken}'
  location: location
  sku: {
    name: appServicePlanSku
  }
}

resource webApp 'Microsoft.Web/sites@2024-04-01' = {
  name: 'API-${resourceToken}'
  location: location
  kind:'app'
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      minTlsVersion: '1.3'
    }
    httpsOnly: true
  }
}

resource webAppConfig 'Microsoft.Web/sites/config@2024-04-01' = {
  parent: webApp
  name: 'web'
  properties: {
    cors: {
      allowedOrigins: [
        appUrl
      ]
    }
  }
}

resource cosmos 'Microsoft.DocumentDB/databaseAccounts@2024-12-01-preview' = {
  name: 'cosmosdb-${resourceToken}'
  kind: 'GlobalDocumentDB'
  location: location
  properties: {
    locations: [
      {
        locationName: dbPrimaryRegion
        failoverPriority: 0
        isZoneRedundant: false
      }
      {
        locationName: dbSecondaryRegion
        failoverPriority: 1
        isZoneRedundant: false
      }
    ]
    databaseAccountOfferType: 'Standard'
    enableFreeTier: true
  }
}

resource cosmosDatabaseAccounts 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases@2024-12-01-preview' = {
  parent: cosmos
  name: 'cosmicworks'
  properties: {
    resource: {
      id: 'cosmicworks'
    }
  }
}

resource cosmosDatabaseAccountsContainers 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2024-12-01-preview' = {
  parent: cosmosDatabaseAccounts
  name: 'products'
  properties: {
    resource: {
      id: 'products'
      partitionKey: {
        paths: [
          '/category'
        ]
        kind: 'Hash'
      }
    }
  }
}
