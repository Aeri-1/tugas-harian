/**
 * Class abstrak untuk representasi tugas.
 * Menggunakan encapsulation dengan properti privat dan static members.
 */
class Tugas {
    // ============= STATIC PROPERTIES =============
    static DEFAULT_DATE = '2000-01-01';  // Tanggal default untuk semua tugas
    static totalTugas = 0;               // Counter untuk semua instance tugas
    
    // ============= PRIVATE PROPERTIES =============
    #judul;
    #tanggal;
    #selesai;
    #prioritas;

    // ============= STATIC METHODS =============
    /**
     * Factory method untuk membuat instance tugas
     * @param {'biasa'|'prioritas'} jenis - Jenis tugas 
     * @param {string} judul - Judul tugas
     * @param {string} tanggal - Tanggal deadline
     * @returns {Tugas} Instance tugas
     */
    static buat(jenis, judul, tanggal = '') {
        Tugas.totalTugas++;
        return jenis === 'prioritas' 
            ? new TugasPrioritas(judul, tanggal)
            : new TugasBiasa(judul, tanggal);
    }

    /**
     * Validasi format tanggal (YYYY-MM-DD)
     * @param {string} dateString 
     * @returns {boolean}
     */
    static isValidDate(dateString) {
        return /^\d{4}-\d{2}-\d{2}$/.test(dateString);
    }

    // ============= CONSTRUCTOR =============
    /**
     * Membuat instance tugas.
     * @param {string} judul - Judul tugas (wajib).
     * @param {string} tanggal - Tanggal deadline (opsional).
     */
    constructor(judul, tanggal = '') {
        this.#judul = judul;
        this.#tanggal = tanggal || Tugas.DEFAULT_DATE;
        this.#selesai = false;
        this.#prioritas = false;
        Tugas.totalTugas++;
    }

    // ============= GETTERS =============
    get judul() {
        return this.#judul;
    }

    get tanggal() {
        return this.#tanggal;
    }

    get selesai() {
        return this.#selesai;
    }

    get prioritas() {
        return this.#prioritas;
    }

    // ============= SETTERS =============
    /**
     * @param {string} value - Judul baru.
     * @throws {Error} Jika judul kosong.
     */
    set judul(value) {
        if (!value || value.trim() === '') {
            throw new Error('Judul tidak boleh kosong');
        }
        this.#judul = value;
    }

    /**
     * @param {string} value - Tanggal dalam format YYYY-MM-DD.
     * @throws {Error} Jika format tanggal invalid.
     */
    set tanggal(value) {
        if (value && !Tugas.isValidDate(value)) {
            throw new Error('Format tanggal harus YYYY-MM-DD');
        }
        this.#tanggal = value || Tugas.DEFAULT_DATE;
    }

    /**
     * @param {boolean} value - Status prioritas.
     */
    set prioritas(value) {
        this.#prioritas = Boolean(value);
    }

    // ============= METHODS =============
    /**
     * Tandai tugas sebagai selesai.
     * @returns {string} Konfirmasi penyelesaian.
     */
    tugasSelesai() {
        this.#selesai = true;
        return `${this.#judul} telah selesai.`;
    }

    /**
     * Dapatkan status tugas.
     * @returns {string} Status tugas.
     */
    getStatus() {
        return this.#selesai ? 'Selesai' : 'Belum selesai';
    }

    /**
     * Serialize tugas untuk penyimpanan.
     * @returns {Object} Data tugas dalam format JSON.
     */
    toJSON() {
        return {
            judul: this.#judul,
            tanggal: this.#tanggal,
            selesai: this.#selesai,
            prioritas: this.#prioritas
        };
    }
}

/**
 * Class untuk tugas biasa (non-prioritas).
 * Mewarisi encapsulation dari class Tugas.
 */
class TugasBiasa extends Tugas {
    constructor(judul, tanggal = '') {
        super(judul, tanggal);
        this.prioritas = false;
    }
}

/**
 * Class untuk tugas prioritas.
 * Mewarisi encapsulation dari class Tugas.
 */
class TugasPrioritas extends Tugas {
    constructor(judul, tanggal = '') {
        super(judul, tanggal);
        this.prioritas = true;
    }

    /**
     * Static method khusus tugas prioritas
     * @returns {string} Level prioritas
     */
    static getLevelPrioritas() {
        return 'HIGH';
    }
}

export { Tugas, TugasBiasa, TugasPrioritas };