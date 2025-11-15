/*
  # Atualizar Equipa para Nomes e Descrições em Português

  1. Alterações
    - Atualizar nomes dos membros da equipa para nomes portugueses
    - Traduzir cargos (roles) para português
    - Traduzir biografias (bio) para português mantendo o profissionalismo

  2. Membros da Equipa Atualizados
    - **Beatriz Silva** - Estilista Principal & Proprietária
      - Mais de 15 anos de experiência em transformações de cor e penteados de noiva
    
    - **Sofia Carvalho** - Colorista Sénior
      - Especialista em balayage e técnicas ombré com formação internacional
    
    - **Carolina Ferreira** - Especialista em Unhas
      - Criação de nail art deslumbrante e aplicações em gel e acrílico
    
    - **Rita Oliveira** - Maquilhadora Profissional
      - Especializada em maquilhagem de noiva e eventos especiais

  3. Notas Importantes
    - Mantém a estrutura da tabela existente
    - Preserva os order_index e image_url originais
    - Atualiza apenas os campos name, role e bio
*/

-- Atualizar Beatriz Silva (anteriormente Isabella Rose)
UPDATE team_members
SET 
  name = 'Beatriz Silva',
  role = 'Estilista Principal & Proprietária',
  bio = 'Com mais de 15 anos de experiência, Beatriz é especialista em transformações de cor e penteados de noiva. Fundou o salão com a visão de criar um espaço acolhedor dedicado à beleza e bem-estar.'
WHERE order_index = 1;

-- Atualizar Sofia Carvalho (anteriormente Sofia Chen)
UPDATE team_members
SET 
  name = 'Sofia Carvalho',
  role = 'Colorista Sénior',
  bio = 'Sofia é a nossa especialista em cor, dominando técnicas de balayage e ombré. Com formação em Paris e Nova Iorque, traz experiência internacional a cada cliente.'
WHERE order_index = 2;

-- Atualizar Carolina Ferreira (anteriormente Emma Laurent)
UPDATE team_members
SET 
  name = 'Carolina Ferreira',
  role = 'Especialista em Unhas',
  bio = 'Carolina cria nail art deslumbrante e é especialista em aplicações de gel e acrílico. A sua atenção ao detalhe e designs criativos tornam-na muito requisitada.'
WHERE order_index = 3;

-- Atualizar Rita Oliveira (anteriormente Olivia Martinez)
UPDATE team_members
SET 
  name = 'Rita Oliveira',
  role = 'Maquilhadora Profissional',
  bio = 'Maquilhadora certificada especializada em maquilhagem de noiva e eventos especiais. Rita já trabalhou com noivas de todo o mundo e adora fazer com que as clientes se sintam lindas.'
WHERE order_index = 4;
