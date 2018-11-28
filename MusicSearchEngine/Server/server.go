// REF: ACCOUNT KEY: https://firebase.google.com/docs/admin/setup
// REF: BASIC SETUP: https://firebase.google.com/docs/database/admin/start
// REF: OHTE API: https://godoc.org/firebase.google.com/go/db



package main
import (
		"fmt"
        "golang.org/x/net/context"
        firebase "firebase.google.com/go"
        "google.golang.org/api/option"
        // "reflect"
        "encoding/json"
	    "github.com/gorilla/mux"
	    // "github.com/gorilla/handlers"
	    "log"
	    "net/http"
	    // "os"
)


type Music struct {
    Title  string   `json:"title,omitempty"`
    Artist string   `json:"artist,omitempty"`
    Album  string   `json:"album,omitempty"`
    Year   string `json:"year,omitempty"`
    Genre  string `json:"genre,omitempty"`
}

var songs []Music

func GetSongs(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Access-Control-Allow-Origin", "*")

    w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	// Initialize tmp_song to an empty array
	var tmp_songs []Music
	params := r.URL.Query()
	if len(params)==0{
		fmt.Println("full query; query successful!!")
		tmp_songs = songs

		var m = map[string][]Music{
			"music": tmp_songs,
		}
		json.NewEncoder(w).Encode(m)
	} else{
		// If there is parameter, filter the output by parameters
		fmt.Println("query parameters: ", params)
		fmt.Println(params.Get("title")=="")

		for _, item := range songs {
			// Check if the paramters match. Or ignore the attribute if it's not in the url parameter
	        if ((item.Title == params.Get("title")||params.Get("title")=="")&&(item.Artist == params.Get("artist")||params.Get("artist")=="")&&(item.Album == params.Get("album")||params.Get("album")=="")&&(item.Year == params.Get("year")||params.Get("year")=="")&&(item.Genre == params.Get("genre")||params.Get("genre")=="")) {
	        	tmp_songs = append(tmp_songs, item)
	        }
	    }
		json.NewEncoder(w).Encode(tmp_songs)
	}
    
}

func main(){

	ctx := context.Background()
	conf := &firebase.Config{
	        DatabaseURL: "https://inf-551-project.firebaseio.com",
	}
	// Fetch the service account key JSON file contents
	opt := option.WithCredentialsFile("./inf-551-project-firebase-adminsdk-eba9f-36695efb61.json")

	// Initialize the app with a service account, granting admin privileges
	app, err := firebase.NewApp(ctx, conf, opt)
	if err != nil {
	        log.Fatalln("Error initializing app:", err)
	}

	client, err := app.Database(ctx)
	if err != nil {
	        log.Fatalln("Error initializing database client:", err)
	}

	// As an admin, the app has access to read and write all data, regradless of Security Rules
	ref := client.NewRef("/")
	var data map[string]interface{}
	if err := ref.Get(ctx, &data); err != nil {
	        log.Fatalln("Error reading from database:", err)
	}

	// fmt.Println(reflect.TypeOf(data["music"]))
	// fmt.Println(data["music"].([]interface {})[0].(map[string]interface{})["title"])

	// Load the entire music list to an slice in Go
	for _,item := range data["music"].([]interface {}){
		songs = append(songs, Music{Title: item.(map[string]interface{})["title"].(string),  Artist: item.(map[string]interface{})["artist"].(string), Album: item.(map[string]interface{})["album"].(string), Year: item.(map[string]interface{})["year"].(string), Genre: item.(map[string]interface{})["genre"].(string) })

	}

	fmt.Println(songs)

	// headersOk := handlers.AllowedHeaders([]string{"X-Requested-With"})
	// originsOk := handlers.AllowedOrigins([]string{os.Getenv("ORIGIN_ALLOWED")})
	// methodsOk := handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT", "OPTIONS"})


	router := mux.NewRouter()
	addr := ":8000"
    router.HandleFunc("/songs", GetSongs).Methods("GET", "OPTIONS" )
    log.Println("listen on", addr)
    log.Fatal(http.ListenAndServe(":8000", router))

}
