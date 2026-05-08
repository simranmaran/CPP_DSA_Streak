
#include<iostream>
using namespace std;
int main(){
  int arr[5]={1,2,3,4,5};


  int len=sizeof(arr)/sizeof(int);  //formula for finding the pure array length
for(int i=0;i<len;i++){
  cin>>arr[i];
}
cout<<endl;

  for(int i=0; i<len; i++){

    cout<<arr[i]<<" ";

  }
}