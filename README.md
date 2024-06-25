# Panassh
Final project mata kuliah Pengembangan Sistem dan Operasi (PSO) atau DevOps di Sistem Informasi ITS 2024.

##  Project

### Scope
Mengembangkan website untuk melihat data suhu pada rentang waktu 1900 hingga 2013

### Objectives
Build website serta melakukan otomasi testing yang kemudian mendeploynya ke server

## Pipeline
### 1. Local
Pengembangan website dilakukan oleh developer pada device masing-masing. Setiap developer dapat menambahkan code atau fitur ke dalam repository baik ke branch main atau dengan membuat branch baru untuk setiap fitur.

### 2. Github
Github digunakan sebagai version control system (VCS) untuk mensinkronisasi pekerjaan setiap developer. Repository ini merupakan hasil clone dari repository github asal sehingga hanya terdapat 1 branch yaitu main. Setiap anggota kelompok telah ditambahkan pada daftar contributor sehingga masing-masing anggota dapat langsung melakukan `git push` ke branch `main`

### 2.5 Github Actions
Github Actions dipilih sebagai tool Continuous Improvement/Continuous Development (CI/CD) yang berfungsi untuk mengotomasi proses dari development, build, test, push, dan deploy. 

    name: Pipeline
    
    on:
	    push:
	     	branches:
				- main

Kode konfigurasi di atas bermakna workflow yang dibuat bernama Pipeline dan akan secara otomatis berjalan ketika terdapat perintah `push` pada branch `main`

    jobs:
    	build-and-deploy:
    		runs-on: ubuntu-latest
Kode di atas bermakna bahwa job yang dilakukan pada workflow ini  bernama `build-and-deploy` dan berjalan di atas operating system (OS) Ubuntu versi terbaru
 
 ### 3. Build
 
 Proses build dilakukan dengan menggabungkan panduan yang diberikan secara default oleh React serta panduan dari dokumentasi Docker. Docker image yang telah dibuild akan disimpan pada repository Google Cloud Registry (GCR) untuk memudahkan deployment pada Google Cloud Platform (GCP). 
 

  

      steps:
	    - name: Checkout repository 
	      uses: actions/checkout@v2
	   
	    - name: Set up Node.js
		  uses: actions/setup-node@v2
	      with:
		      node-version: '19.8.1'
	  
	    - name: Install dependencies 
		  run: npm install
			 
	    - name: Build project
		  run: npm run build

 Kode konfigurasi di atas berfungsi untuk melakukan proses build. Step `Checkout  repository` berfungsi untuk melakukan clone repository untuk dilakukan step berikutnya. Step `Set up Node.js` berfungsi untuk mempersiapkan environment node.js pada Github Actions. Step `Install dependencies` berfungsi untuk mempersiapkan segala dependency aplikasi yang berbasis node.js. Terakhir, step Build project berfungsi untuk melakukan bundling dan menghasilkan file web (html, css, js) yang telah teroptimasi. 
 
 ### 4. Testing
 Proses testing dilakukan untuk memastikan bahwa kode yang telah dibuild memenuhi persyaratan yang telah ditetapkan.

	     - name: Testing
	       run: npm test
Kode di atas berfungsi untuk melakukan testing pada source code yang telah dibuild. Perintah `npm test` diperoleh dari dokumentasi React dan node.js

### 5. Push to Google Cloud Registry
Proses push dilakukan untuk membuat docker image berdasarkan Dockerfile yang telah dibuat, kemudian mengirimkan image tersebut ke GCR. Username dan password disimpan menggunakan fitur repository secrets supaya tidak diketahui oleh publik.

	   - name: Log in to GCR
	     uses: docker/login-action@v2
	     with:
		    registry: gcr.io
		    username: _json_key
		    password: ${{ secrets.GCP_SA_KEY }}
	   
	   - name: Build Docker Image
	     run: docker build -t gcr.io/${{ secrets.GCP_PROJECT_ID }}/my-react-app:${{ github.sha }} .
	   
	   - name: Push Docker Image
	     run: docker push gcr.io/${{ secrets.GCP_PROJECT_ID }}/my-react-app:${{ github.sha }}

Kode konfigurasi di atas berfungsi untuk melakukan proses push. Step `Log in to GCR` berfungsi untuk mengotentikasi akun GCR.  Step `Build Docker Image` berfungsi untuk menghasilkan docker image berdasarkan Dockerfile yang telah tersedia. Step `Push Docker Image` berfungsi untuk mengupload docker image yang telah dibuat ke GRC supaya dapat dipull dari server pada proses deployment.
 
 ### 6. Deployment
 Proses deployment dilakukan untuk menjalankan docker image yang tersimpan pada GCR menggunakan platform Google Cloud Platform (GCP). 

		- name: Authenticate to GCP
		  uses: google-github-actions/auth@v1
		  with:
			  credentials_json: ${{ secrets.GCP_SA_KEY }}
			  project_id: ${{ secrets.GCP_PROJECT_ID }}
		
		- name: Set up Google Cloud SDK
		  uses: google-github-actions/setup-gcloud@v1
		  with:
			  project_id: ${{ secrets.GCP_PROJECT_ID }}

		- name: Deploy to App Engine
		  run: gcloud app deploy --image-url=gcr.io/${{ secrets.GCP_PROJECT_ID }}/my-react-app:${{ github.sha }} --quiet

Kode konfigurasi di atas berfungsi untuk melakukan deployment pada GCP. Step `Authenticate to GCP` berfungsi untuk mengotentikasi akun GCP. Step Set up `Google Cloud SDK` berfungsi untuk mempersiapkan environment pada GCP. Step `Deploy to App Engine` berfungsi untuk mendeploy docker image pada GCR ke App Engine GCP.

### 7.Monitor
Proses monitoring dilakukan untuk memastikan aplikasi web yang telah dideploy di GCP dapat terus diakses oleh pengguna. Monitoring dilakukan menggunakan fitur Monitoring pada GCP yang dapat mencatat CPU usage, RAM usage, konektivitas, latency, dan slow response pengunjung.
