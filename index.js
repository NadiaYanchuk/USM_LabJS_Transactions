const fs = require('fs');

/**
 * Класс, представляющий транзакцию
 */
class Transaction {
    /**
     * Создает транзакцию
     * @param {Object} transaction - Объект
     * @param {string} transaction.transaction_id - Идентификатор
     * @param {string} transaction.transaction_date - Дата 
     * @param {string} transaction.transaction_amount - Сумма 
     * @param {string} transaction.transaction_type - Тип 
     * @param {string} transaction.transaction_description - Описание
     * @param {string} transaction.merchant_name - Название торговой точки
     * @param {string} transaction.card_type - Тип карты
     */
    constructor(transaction) {
        this.transaction_id = transaction.transaction_id;
        this.transaction_date = transaction.transaction_date;
        this.transaction_amount = transaction.transaction_amount;
        this.transaction_type = transaction.transaction_type;
        this.transaction_description = transaction.transaction_description;
        this.merchant_name = transaction.merchant_name;
        this.card_type = transaction.card_type;
    }

    /**
     * Получить строковое представление
     * @returns {string} Строковое представление в формате JSON
     */
    toString() {
        return JSON.stringify(this, null, 2);
    }
}

/**
 * Класс для обработки транзакций
 */
class TransactionAnalyzer {
    /**
     * Создает анализатор транзакций
     * @param {Transaction[]} transactions - Массив транзакций
     */
    constructor(transactions) {
        this.transactions = transactions;
    }

    /**
     * Добавить новую транзакцию
     * @param {Transaction} transaction - Новая транзакция для добавления
     */
    addTransaction(transaction) {
        this.transactions.push(transaction);
    }

    /**
     * Получить все транзакции
     * @returns {Transaction[]} Массив всех транзакций
     */
    getAllTransactions() {
        return this.transactions;
    }

    /**
     * Получить уникальные типы транзакций
     * @returns {string[]} Массив уникальных типов транзакций
     */
    getUniqueTransactionTypes() {
        const types = this.transactions.map(transaction => transaction.transaction_type);
        return [...new Set(types)];
    }

    /**
     * Рассчитать общую сумму всех транзакций
     * @returns {number} Общая сумма всех транзакций
     */
    calculateTotalAmount() {
        return this.transactions.reduce((total, transaction) => total + parseFloat(transaction.transaction_amount), 0);
    }

    /**
     * Рассчитать общую сумму транзакций за определенную дату
     * @param {number} [year] - Год
     * @param {number} [month] - Месяц
     * @param {number} [day] - День
     * @returns {number} Общая сумма транзакций за указанную дату
     */
    calculateTotalAmountByDate(year, month, day) {
        return this.transactions
            .filter(transaction => {
                const date = new Date(transaction.transaction_date);
                return (!year || date.getFullYear() === year) &&
                       (!month || date.getMonth() + 1 === month) &&
                       (!day || date.getDate() === day);
            })
            .reduce((total, transaction) => total + parseFloat(transaction.transaction_amount), 0);
    }

    /**
     * Получить транзакции по типу
     * @param {string} type - Тип транзакций для получения (например, 'debit' или 'credit')
     * @returns {Transaction[]} Массив транзакций указанного типа
     */
    getTransactionByType(type) {
        return this.transactions.filter(transaction => transaction.transaction_type === type);
    }

    /**
     * Получить транзакции в диапазоне дат
     * @param {string} startDate - Начальная дата диапазона
     * @param {string} endDate - Конечная дата диапазона
     * @returns {Transaction[]} Массив транзакций в указанном диапазоне дат
     */
    getTransactionsInDateRange(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return this.transactions.filter(transaction => {
            const date = new Date(transaction.transaction_date);
            return date >= start && date <= end;
        });
    }

    /**
     * Получить транзакции по названию торговой точки
     * @param {string} merchantName - Название торговой точки
     * @returns {Transaction[]} Массив транзакций для указанной торговой точки
     */
    getTransactionsByMerchant(merchantName) {
        return this.transactions.filter(transaction => transaction.merchant_name === merchantName);
    }

    /**
     * Рассчитать среднюю сумму транзакций
     * @returns {number} Средняя сумма транзакций
     */
    calculateAverageTransactionAmount() {
        const totalAmount = this.calculateTotalAmount();
        return totalAmount / this.transactions.length;
    }

    /**
     * Получить транзакции по диапазону сумм
     * @param {number} minAmount - Минимальная сумма
     * @param {number} maxAmount - Максимальная сумма
     * @returns {Transaction[]} Массив транзакций в указанном диапазоне сумм
     */
    getTransactionsByAmountRange(minAmount, maxAmount) {
        return this.transactions.filter(transaction => {
            const amount = parseFloat(transaction.transaction_amount);
            return amount >= minAmount && amount <= maxAmount;
        });
    }

    /**
     * Рассчитать общую сумму дебетовых транзакций
     * @returns {number} Общая сумма дебетовых транзакций
     */
    calculateTotalDebitAmount() {
        return this.getTransactionByType('debit')
            .reduce((total, transaction) => total + parseFloat(transaction.transaction_amount), 0);
    }

    /**
     * Найти месяц с наибольшим количеством транзакций
     * @returns {string} Месяц с наибольшим количеством транзакций
     */
    findMostTransactionsMonth() {
        const counts = {};
        this.transactions.forEach(transaction => {
            const month = transaction.transaction_date.substring(0, 7);
            counts[month] = (counts[month] || 0) + 1;
        });
        return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    }

    /**
     * Найти месяц с наибольшим количеством дебетовых транзакций
     * @returns {string} Месяц с наибольшим количеством дебетовых транзакций
     */
    findMostDebitTransactionMonth() {
        const counts = {};
        this.getTransactionByType('debit').forEach(transaction => {
            const month = transaction.transaction_date.substring(0, 7);
            counts[month] = (counts[month] || 0) + 1;
        });
        return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    }

    /**
     * Определить, какой тип транзакций встречается чаще
     * @returns {string} 'debit', 'credit' или 'equal' в зависимости от количества каждого типа транзакций
     */
    mostTransactionTypes() {
        const debitCount = this.getTransactionByType('debit').length;
        const creditCount = this.getTransactionByType('credit').length;
        if (debitCount > creditCount) return 'debit';
        if (creditCount > debitCount) return 'credit';
        return 'equal';
    }

    /**
     * Получить транзакции до определенной даты
     * @param {string} date - Дата до которой возвращаются транзакции
     * @returns {Transaction[]} Массив транзакций до указанной даты
     */
    getTransactionsBeforeDate(date) {
        const specifiedDate = new Date(date);
        return this.transactions.filter(transaction => new Date(transaction.transaction_date) < specifiedDate);
    }

    /**
     * Найти транзакцию по ее идентификатору
     * @param {string} id - Идентификатор транзакции для поиска
     * @returns {Transaction|null} Транзакция с указанным идентификатором или null, если не найдена
     */
    findTransactionById(id) {
        return this.transactions.find(transaction => transaction.transaction_id === id) || null;
    }

    /**
     * Отобразить описания транзакций
     * @returns {string[]} Массив описаний транзакций
     */
    mapTransactionDescriptions() {
        return this.transactions.map(transaction => transaction.transaction_description);
    }
}

fs.readFile('transaction.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Ошибка при чтении файла:', err);
        return;
    }

    const transactions = JSON.parse(data).map(tx => new Transaction(tx));
    const analyzer = new TransactionAnalyzer(transactions);

    // Методы для обработки данных о транзакциях
    console.log('1. Существующие типы транзакций:', analyzer.getUniqueTransactionTypes());
    console.log('2. Общая сумма всех транзакций:', analyzer.calculateTotalAmount());
    console.log('3. Общая сумма за дату (2019-01-01):', analyzer.calculateTotalAmountByDate(2019, 1, 1));
    console.log('4.а) Вывод транзакции указанного типа (пример: debit):', analyzer.getTransactionByType('debit').map(tx => tx.toString()));
    console.log('4.б) Вывод транзакции указанного типа (пример: credit):', analyzer.getTransactionByType('credit').map(tx => tx.toString()));
    console.log('5. Транзакции в диапазоне дат (пример: 2019-01-01 до 2019-01-31):', analyzer.getTransactionsInDateRange('2019-01-01', '2019-01-31').map(tx => tx.toString()));
    console.log('6. Транзакции, совершенные с указанным торговым местом или компанией (пример: SuperMart):', analyzer.getTransactionsByMerchant('SuperMart').map(tx => tx.toString()));
    console.log('7. Среднее значение транзакций:', analyzer.calculateAverageTransactionAmount());
    console.log('8. Транзакции в диапазоне сумм (50 до 200):', analyzer.getTransactionsByAmountRange(50, 200).map(tx => tx.toString()));
    console.log('9. Общая сумма дебетовых транзакций:', analyzer.calculateTotalDebitAmount());
    console.log('10. Месяц с наибольшим количеством транзакций:', analyzer.findMostTransactionsMonth());
    console.log('11. Месяц с наибольшим количеством дебетовых транзакций:', analyzer.findMostDebitTransactionMonth());
    console.log('12. Тип транзакций, встречающихся чаще всего:', analyzer.mostTransactionTypes());
    console.log('13. Транзакции до даты (2019-01-05):', analyzer.getTransactionsBeforeDate('2019-01-05').map(tx => tx.toString()));
    console.log('14. Транзакция по ID (1):', analyzer.findTransactionById('1'));
    console.log('15. Описания транзакций:', analyzer.mapTransactionDescriptions());
});
