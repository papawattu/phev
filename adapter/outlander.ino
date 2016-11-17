#include <SoftwareSerial.h>
#include <ESP8266WiFi.h>
#include <ArduinoJson.h>

#define DEBUG
#define RESET_GPIO      14
#define OK              "OK"
#define ERROR           "ERROR"
#define RETRY_TIMEOUT   5000
#define MAX_ATTEMPTS    5

#define INIT            0
#define AT              1
#define AT_CMGF         2
#define AT_CGATT_Q      3
#define AT_CGATT        4
#define AT_CIPCSGP      5
#define AT_CSTT         6
#define AT_CIICR        7
#define AT_CIFSR        8
#define AT_CIPSTART     9
#define AT_CIPSEND      10
#define AT_CIPSHUT      11

#define APN             "everywhere"
#define APN_USERNAME    "eesecure"
#define APN_PASSWORD    "secure"

#define RDY             "READY"
#define MAX_PARAMS    10

struct SIM300AT {
  const char *  cmd;
  const char *  response;
  int     numOfParams;
  boolean quotes[MAX_PARAMS];
  boolean retry;
} atCommands[15] = {
  {"AT",RDY, 0,{},true},
  {"AT","OK", 0,{},true},          
  {"AT+CMGF","OK", 1,{false},true},
  {"AT+CGATT?","+CGATT: 1", 0,{},true},
  {"AT+CGATT","OK", 1,{false},true},
  {"AT+CIPCSGP","OK", 4,{false,true,true,true},true},
  {"AT+CSTT","OK", 0,{},true},
  {"AT+CIICR","OK", 0,{},true},
  {"AT+CIFSR","", 0,{},true},
  {"AT+CIPSTART","CONNECT OK", 3,{true,true,true},true},
  {"AT+CIPSEND","", 0,{},true},
  {"AT+CIPSHUT",">", 0,{},true},
};

const char* ssid      = "BTHub3-HSZ3";
const char* wifipassword  = "simpsons";
//echo -ne '\xf6\x04\x00\x0a\x01\x05'
const char* HOST      = "www.wattu.com";
const char* PORT      = "1974";

int counter;

StaticJsonBuffer<200> jsonBuffer;

SoftwareSerial swSer(4, 5, false, 256);

void setupSerial() {
  Serial.begin(115200);
  swSer.begin(115200);
  for (char ch = ' '; ch <= 'z'; ch++) {
    swSer.write(ch);
  }
  swSer.println("");
  delay(100);
  while(swSer.available() > 0) {
    swSer.read();
  }
  Serial.println("\nSerial started");

}

void setupWifi() {
  Serial.println("\nWifi starting");

  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, wifipassword);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");  
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  Serial.println("\nWiFi started");
 
}


void setupSIM300() {
  const char * params[] = {};
  char buf[256];
  boolean ready = false;
  int i = 0;
  char *ptr;
  Serial.println("\nSIM300 reset");

  pinMode(RESET_GPIO,OUTPUT);
  digitalWrite(RESET_GPIO,LOW);
  delay(100);
  digitalWrite(RESET_GPIO,HIGH);
  delay(1000);

  Serial.println("\nSIM300 starting");

  Serial.println("\nSIM300 started");

  for(i=0;i<3;i++) {
    sendSIM300Command(AT,0,{});
  }

}
void setup() {

  setupSerial();

  setupSIM300();
  
  connectToGPRS();

  getWANIP();
  
  connectToServer();

  setupWifi();

  counter = 0;
}

void loop() {
  /*
  while (swSer.available() > 0) {
    Serial.write(swSer.read());
  }
  while (Serial.available() > 0) {
    swSer.write(Serial.read());
  } */
  sendSIM300Command(AT_CIPSEND,0,{});
  swSer.write("PING\n");
  delay(1000);
}

boolean checkSIM300Command(int cmd,const char * resp) {
  
  char *ptr;
  Serial.print("Checking SIM300 response : ");
  Serial.println(atCommands[cmd].cmd);
  
  ptr = strstr(resp,atCommands[cmd].response);
        
  if(ptr != NULL) {
    Serial.println("SIM300 response OK ");
    return true;
  } 
  Serial.print("SIM300 response failed!!! ptr is ");
  Serial.print((ptr==NULL?"True":"False"));
  Serial.print(" resp is :");
  Serial.print(resp);
  Serial.print(" expecting :");
  Serial.println(atCommands[cmd].response);
  
  
  return false;
}
void sendSIM300Command(int cmd, int numParams, const char * params[]) {

  char resp[1024];
  int i,j;
  boolean completed;
  char cmdString[200];
  int attempts;
  if(numParams != atCommands[cmd].numOfParams) {
    Error("Not correct number of parameters");
  }

  completed = false;

  memset(resp,0,sizeof(resp));
  Serial.println("Flush buffer");
  while(swSer.available() > 0) {
    swSer.read();
  }
  do {
    
    strcpy(cmdString, atCommands[cmd].cmd);
    for(j=0;j<numParams;j++) {
        
      if(j == 0) {
        strcat(cmdString,"=");
      } else {
        strcat(cmdString,",");
      }
      if(atCommands[cmd].quotes[j]) {
        strcat(cmdString,"\"");
      }
      strcat(cmdString,params[j]);
      if(atCommands[cmd].quotes[j]) {
        strcat(cmdString,"\"");
      }
    }
    Serial.print("Sending SIM300 command : ");
    Serial.println(cmdString);
    swSer.println(cmdString);

    delay(1000);
    i = 0;
    attempts = 0;
    do {
      
      while(swSer.available() > 0) {
        resp[i++] = swSer.read();
      }
        
#ifdef DEBUG
      Serial.println("\n------------------------------ ");
      for(j=0;j<i;j++) {
       Serial.write(resp[j]);
      }
      Serial.println("\n------------------------------ ");
     
#endif
      if(checkSIM300Command(cmd,resp)) {
          completed = true;
      }
      attempts ++;
      if(completed == false) {
        Serial.println("Waiting for response ...");
        delay(1000);
      } else {
        return;
      }
    } while (attempts < MAX_ATTEMPTS);
    Serial.println("Retrying command");
          
    delay(RETRY_TIMEOUT);
  } while(!completed);
  
}

void connectToServer() {
  const char * params[] = {"TCP",HOST,PORT};
  
  Serial.print("Connecting to server ");
  Serial.print(HOST);
  Serial.print(" port :");
  Serial.println(PORT);
  sendSIM300Command(AT_CIPSTART,3,params);

}

void connectToAPN() {
  String resp;
  const char * params[] = {"1",APN,APN_USERNAME,APN_PASSWORD};
  Serial.println("Setting APN");

  sendSIM300Command(AT_CIPCSGP,4,params);

  Serial.println("Set APN");

}
void connectToGPRS() {
  const char * params[] = {"1"};

  sendSIM300Command(AT_CGATT_Q,0,{});

  connectToAPN();  

  Serial.println("Starting task");
  
  sendSIM300Command(AT_CSTT,0,params);

  Serial.println("Started task");
  
  Serial.println("Connecting to GPRS");
  
  sendSIM300Command(AT_CIICR,0,params);
  
  Serial.println("Connected to GPRS");
  
}

void getWANIP() {
  Serial.println("Gettin WAN IP address");
  
  sendSIM300Command(AT_CIFSR,0,{});
  
  Serial.println("Got WAN IP address");
}

void Error(String err) {
  Serial.println(err);
  while(true) {
    yield();
  }
}


