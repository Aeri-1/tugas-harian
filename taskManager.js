// Import kelas tugas biasa dan prioritas
import { TugasBiasa, TugasPrioritas } from './task.js';

class ManajerTugas {
    #daftarTugas = [];

    constructor() {
        this.#muatDariPenyimpanan();
    }

    // Tambah tugas baru
    tambahTugas(judul, prioritas = false, tanggal = '') {
        if (this.#daftarTugas.some(t => t.judul === judul)) {
            return false; // Duplikat
        }

        const tugasBaru = prioritas
            ? new TugasPrioritas(judul, tanggal)
            : new TugasBiasa(judul, tanggal);

        this.#daftarTugas.push(tugasBaru);
        this.#simpanKePenyimpanan();
        return true;
    }

    // Edit tugas berdasarkan judul lama
    editTugas(judulLama, judulBaru, prioritasBaru = false, tanggalBaru = '') {
        const index = this.#daftarTugas.findIndex(t => t.judul === judulLama);
        if (index === -1) return false;

        const tugasLama = this.#daftarTugas[index];
        const sudahSelesai = tugasLama.selesai;

        const tugasBaru = prioritasBaru
            ? new TugasPrioritas(judulBaru, tanggalBaru)
            : new TugasBiasa(judulBaru, tanggalBaru);

        if (sudahSelesai) tugasBaru.tugasSelesai();

        this.#daftarTugas[index] = tugasBaru;
        this.#simpanKePenyimpanan();
        return true;
    }

    // Hapus tugas
    hapusTugas(judul) {
        this.#daftarTugas = this.#daftarTugas.filter(t => t.judul !== judul);
        this.#simpanKePenyimpanan();
    }

    // Tandai selesai
    tandaiSelesai(judul) {
        const tugas = this.#daftarTugas.find(t => t.judul === judul);
        if (tugas) {
            tugas.tugasSelesai();
            this.#simpanKePenyimpanan();
        }
    }

    // Kembalikan semua tugas
    filterTugas() {
        return this.#daftarTugas;
    }

    // Simpan ke localStorage, simpan juga informasi prioritas
    #simpanKePenyimpanan() {
        const data = this.#daftarTugas.map(t => ({
            judul: t.judul,
            tanggal: t.tanggal,
            selesai: t.selesai,
            prioritas: t instanceof TugasPrioritas // penting!
        }));
        localStorage.setItem('daftarTugas', JSON.stringify(data));
    }

    // Muat dari localStorage
    #muatDariPenyimpanan() {
        const data = localStorage.getItem('daftarTugas');
        if (data) {
            try {
                const list = JSON.parse(data);
                this.#daftarTugas = list.map(obj => {
                    const tugas = obj.prioritas
                        ? new TugasPrioritas(obj.judul, obj.tanggal)
                        : new TugasBiasa(obj.judul, obj.tanggal);
                    if (obj.selesai) tugas.tugasSelesai();
                    return tugas;
                });
            } catch (err) {
                console.error('Gagal memuat data tugas dari localStorage:', err);
                this.#daftarTugas = [];
            }
        }
    }
}

export default ManajerTugas;
