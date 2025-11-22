/*
  # Update Price for Corte e Penteado Service

  1. Changes
    - Update "Corte e Penteado" service price from €20.00 to €23.00
  
  2. Details
    - Service: Corte e Penteado (Haircut and Styling)
    - Old Price: €20.00
    - New Price: €23.00
    - Reason: Price adjustment as requested
  
  3. Notes
    - Only affects the "Corte e Penteado" service
    - No other services are modified
    - Frontend will automatically reflect the new price from database
*/

-- Update price for Corte e Penteado service
UPDATE services
SET price = 23.00
WHERE name = 'Corte e Penteado';