az deployment group create \
    --resource-group FoodDeliveryWeb \
    --template-file main.bicep \
    --parameters parameters.json
