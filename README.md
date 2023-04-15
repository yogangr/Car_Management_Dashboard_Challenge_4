# Car Management Dashboard

# ERD

![Alt text](/erd.png "a title")

## Client

1. Halaman Homepage (GET) http://localhost:3000/
2. Halaman Input Data (POST) http://localhost:3000/create-data
3. Halaman Edit Data (GET) http://localhost:3000/edit-car/:id
4. Menampilkan Hasil Filter (GET) http://localhost:3000/api/filter?filter=
5. Menampilkan Hasil Search (POST) http://localhost:3000/search

## API

1. Tambah Data Mobil (POST) http://localhost:3000/api/cars
2. Menampilkan Semua Data (GET) http://localhost:3000/api/cars
3. Menampilkan Satu Data (GET) http://localhost:3000/api/cars/:id
4. Edit Data Mobil (POST) http://localhost:3000/api/cars/:id
5. Hapus Data Mobil (GET) http://localhost:3000/api/cars/delete/:id
6. Filter (GET) http://localhost:3000/api/filter
7. Search (GET) http://localhost:3000/api/search/:search

# Endpoint

- Request Body GET All Data

---

    "url": "http://localhost:3001/cars",
    "method": "GET",
    "body": {},

- Example Response Body GET All Data

---

    [
        {
            "id": 20,
            "name": "Ferrari",
            "rentCost": 600000,
            "size": "Medium",
            "imgCars": "imgCars-1681566608271.jpg",
            "createdAt": "2023-04-15T13:50:08.402Z",
            "updatedAt": "2023-04-15T13:50:08.402Z"
        },
        {
            "id": 21,
            "name": "Lamborghini",
            "rentCost": 900000,
            "size": "Small",
            "imgCars": "imgCars-1681566649450.jpg",
            "createdAt": "2023-04-15T13:50:49.550Z",
            "updatedAt": "2023-04-15T13:50:49.550Z"
        },
        {
            "id": 22,
            "name": "Lamborghini",
            "rentCost": 850000,
            "size": "Small",
            "imgCars": "imgCars-1681566685345.jpg",
            "createdAt": "2023-04-15T13:51:25.504Z",
            "updatedAt": "2023-04-15T13:51:25.504Z"
        }
    ]

- Request Body GET One Data

---

    "url": "http://localhost:3001/cars/20",
    "method": "GET",
    "body": {},
    "params": { id: '20' },

---

        {
            "id": 20,
            "name": "Ferrari",
            "rentCost": 600000,
            "size": "Medium",
            "imgCars": "imgCars-1681566608271.jpg",
            "createdAt": "2023-04-15T13:50:08.402Z",
            "updatedAt": "2023-04-15T13:50:08.402Z"
        },
