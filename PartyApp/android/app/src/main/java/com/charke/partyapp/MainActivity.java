package com.charke.partyapp;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;

import java.util.ArrayList;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

// import com.google.android.gms.tasks.OnCompleteListener;
// import com.google.android.gms.tasks.Task;

// import com.google.firebase.dynamiclinks.DynamicLink;
// import com.google.firebase.dynamiclinks.FirebaseDynamicLinks;
// import com.google.firebase.dynamiclinks.PendingDynamicLinkData;
// import com.google.firebase.dynamiclinks.ShortDynamicLink;


public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Initializes the Bridge
    this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
      // Additional plugins you've installed go here
      // Ex: add(TotallyAwesomePlugin.class);
    }});
  }

    /*public void createDynamicLink_Basic() {
      // [START create_link_basic]
      DynamicLink dynamicLink = FirebaseDynamicLinks.getInstance().createDynamicLink()
              .setLink(Uri.parse("https://www.test1619.com/"))
              .setDomainUriPrefix("https://test1619.page.link")
              // Open links with this app on Android
              .setAndroidParameters(new DynamicLink.AndroidParameters.Builder().build())
              // Open links with com.example.ios on iOS
              //.setIosParameters(new DynamicLink.IosParameters.Builder("com.example.ios").build())
              .buildDynamicLink();

      Uri dynamicLinkUri = dynamicLink.getUri();
      // [END create_link_basic]
    }


    public void createShortLink() {
      // [START create_short_link]
      Task<ShortDynamicLink> shortLinkTask = FirebaseDynamicLinks.getInstance().createDynamicLink()
              .setLink(Uri.parse("https://www.test1619.com/"))
              .setDomainUriPrefix("https://test1619.page.link")
              // Set parameters
              // ...
              .buildShortDynamicLink()
              .addOnCompleteListener(this, new OnCompleteListener<ShortDynamicLink>() {
                @Override
                public void onComplete(@NonNull Task<ShortDynamicLink> task) {
                  if (task.isSuccessful()) {
                    // Short link created
                    Uri shortLink = task.getResult().getShortLink();
                    Uri flowchartLink = task.getResult().getPreviewLink();
                  } else {
                    // Error
                    // ...
                  }
                }
              });
      // [END create_short_link]
    }*/
}
