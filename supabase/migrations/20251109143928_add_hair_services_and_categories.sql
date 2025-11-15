/*
  # Adicionar Serviços de Cabelo e Organizar por Categorias
  
  1. Alterações nos Serviços Existentes
    - Atualizar "Eyelash Extensions" para categoria "Beleza"
    - Corrigir nome para português: "Extensões de Pestanas"
  
  2. Novos Serviços - Categoria Cabelo
    - **Corte e Penteado**
      - Descrição: Corte personalizado e styling profissional
      - Preço: €20.00
      - Duração: 35 minutos
      - Categoria: Cabelo
      - Imagem: Close-up de penteado profissional
    
    - **Coloração e Madeixas**
      - Descrição: Mudança de cor, mechas ou balayage para realçar o estilo
      - Preço: €50.00
      - Duração: 90 minutos
      - Categoria: Cabelo
      - Imagem: Close-up de coloração de cabelo
  
  3. Estrutura de Categorias
    - Cabelo: Serviços relacionados com corte, penteado e coloração
    - Beleza: Serviços de extensões de pestanas, maquilhagem, etc.
  
  4. Notas Importantes
    - As categorias são apresentadas em português
    - Ordem de apresentação: Cabelo primeiro, depois Beleza
    - Todas as imagens são close-ups de alta qualidade do Pexels
    - Mantém compatibilidade com sistema de agendamento existente
*/

-- Atualizar serviço existente "Eyelash Extensions" para categoria Beleza
UPDATE services
SET 
  name = 'Extensões de Pestanas',
  description = 'Extensões de pestanas naturais ou dramáticas para realçar o olhar',
  category = 'Beleza',
  image_url = 'https://images.pexels.com/photos/7755257/pexels-photo-7755257.jpeg'
WHERE category = 'beauty' OR name = 'Eyelash Extensions';

-- Inserir serviço: Corte e Penteado
INSERT INTO services (name, description, price, duration, category, image_url) 
VALUES (
  'Corte e Penteado',
  'Corte personalizado e styling profissional',
  20.00,
  35,
  'Cabelo',
  'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg'
)
ON CONFLICT DO NOTHING;

-- Inserir serviço: Coloração e Madeixas
INSERT INTO services (name, description, price, duration, category, image_url) 
VALUES (
  'Coloração e Madeixas',
  'Mudança de cor, mechas ou balayage para realçar o estilo',
  50.00,
  90,
  'Cabelo',
  'https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg'
)
ON CONFLICT DO NOTHING;