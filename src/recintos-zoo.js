class RecintosZoo {
    constructor() {
        this.recintos = [
            { numero: 1, bioma: 'savana', tamanho: 10, animais: [{ especie: 'MACACO', quantidade: 3 }] },
            { numero: 2, bioma: 'floresta', tamanho: 5, animais: [] },
            { numero: 3, bioma: 'savana e rio', tamanho: 7, animais: [{ especie: 'GAZELA', quantidade: 1 }] },
            { numero: 4, bioma: 'rio', tamanho: 8, animais: [] },
            { numero: 5, bioma: 'savana', tamanho: 9, animais: [{ especie: 'LEAO', quantidade: 1 }] },
        ];

        this.animaisPermitidos = {
            LEAO: { tamanho: 3, biomas: ['savana'], carnivoro: true },
            LEOPARDO: { tamanho: 2, biomas: ['savana'], carnivoro: true },
            CROCODILO: { tamanho: 3, biomas: ['rio'], carnivoro: true },
            MACACO: { tamanho: 1, biomas: ['savana', 'floresta'], carnivoro: false },
            GAZELA: { tamanho: 2, biomas: ['savana'], carnivoro: false },
            HIPOPOTAMO: { tamanho: 4, biomas: ['savana', 'rio'], carnivoro: false }
        };
    }

    analisaRecintos(animal, quantidade) {
        // Verifica se o animal é válido
        if (!this.animaisPermitidos[animal]) {
            return { erro: "Animal inválido" };
        }

        // Verifica se a quantidade é válida
        if (quantidade <= 0 || !Number.isInteger(quantidade)) {
            return { erro: "Quantidade inválida" };
        }

        const animalInfo = this.animaisPermitidos[animal];
        const recintosViaveis = [];

        for (let recinto of this.recintos) {
            let espacoOcupado = 0;
            let carnívoroPresente = false;
            let misturaEspecies = false;

            // Calcula o espaço ocupado e verifica as condições
            for (let a of recinto.animais) {
                espacoOcupado += this.animaisPermitidos[a.especie].tamanho * a.quantidade;
                if (this.animaisPermitidos[a.especie].carnivoro) {
                    carnívoroPresente = true;
                }
                if (a.especie !== animal) {
                    misturaEspecies = true;
                }
            }

            const espacoLivre = recinto.tamanho - espacoOcupado;
            const espacoNecessario = animalInfo.tamanho * quantidade;

            // Verifica se o bioma é compatível
            if (!animalInfo.biomas.includes(recinto.bioma)) {
                continue;
            }

            // Verifica se o animal carnívoro pode ser adicionado
            if (animalInfo.carnivoro && (recinto.animais.length > 0 || misturaEspecies)) {
                continue;
            }

            // Verifica a regra específica do hipopótamo
            if (animal === 'HIPOPOTAMO' && misturaEspecies && recinto.bioma !== 'savana e rio') {
                continue;
            }

            // Verifica a regra do macaco
            if (animal === 'MACACO' && recinto.animais.length === 0) {
                continue;
            }

            // Considera espaço extra se houver mistura de espécies
            const espacoExtra = misturaEspecies ? 1 : 0;

            // Verifica se há espaço suficiente
            if (espacoNecessario + espacoExtra <= espacoLivre) {
                recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${espacoLivre - espacoNecessario - espacoExtra} total: ${recinto.tamanho})`);
            }
        }

        // Retorna resultados
        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável" };
        }
        return { recintosViaveis };
    }
}

export { RecintosZoo as RecintosZoo };