// https://learn.microsoft.com/en-us/azure/static-web-apps/publish-bicep

targetScope = 'subscription'

param location string ='eastasia'
param resourceGroupName string = 'geometryArtStudio'

@description('String to make resource names unique')
var resourceToken = uniqueString(subscription().subscriptionId, location)

@description('Create a resource group')
resource rg 'Microsoft.Resources/resourceGroups@2024-03-01' = {
  name: '${resourceGroupName}-${resourceToken}'
  location: location
}

@description('Create a static web app')
module swa 'br/public:avm/res/web/static-site:0.3.0' = {
  name: 'client'
  scope: rg
  params: {
    name: 'swa-${resourceToken}'
    location: location
    sku: 'Free'
  }
}

@description('Output the default hostname')
output endpoint string = swa.outputs.defaultHostname

@description('Output the static web app name')
output staticWebAppName string = swa.outputs.name
