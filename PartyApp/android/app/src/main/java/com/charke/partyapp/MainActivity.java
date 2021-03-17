package com.charke.partyapp;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;

import java.util.ArrayList;
import java.util.List;
import android.util.Log;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

 import com.google.android.gms.tasks.OnSuccessListener;
 import com.google.android.gms.tasks.OnFailureListener;
 import com.google.android.gms.tasks.Task;

 import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.ActionCodeResult;

 import com.google.firebase.dynamiclinks.DynamicLink;
 import com.google.firebase.dynamiclinks.FirebaseDynamicLinks;
 import com.google.firebase.dynamiclinks.PendingDynamicLinkData;
 import com.google.firebase.dynamiclinks.ShortDynamicLink;

public class MainActivity extends BridgeActivity {
  public static final String TAG = "tag";
  @Override
  public void onCreate(Bundle savedInstanceState) {
      super.onCreate(savedInstanceState);
      // Initializes the Bridge
      this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
          // Additional plugins you've installed go here
          // Ex: add(TotallyAwesomePlugin.class);
      }});
      /*createDynamicLink_Basic();
      handleIntent(getIntent());*/
  }
  }


      /*FirebaseDynamicLinks.getInstance().getDynamicLink(getIntent())
              .addOnSuccessListener(this, pendingDynamicLinkData -> {
              Log.i(TAG, "Dynamic link detected");
              if (pendingDynamicLinkData != null &  pendingDynamicLinkData.getLink() != null) {
              String oobCode = pendingDynamicLinkData.getLink().getQueryParameter("oobCode");
              if (oobCode != null) {
              FirebaseAuth.checkActionCode(oobCode).addOnSuccessListener(result -> {
              switch (result.getOperation()) {
              case ActionCodeResult.VERIFY_EMAIL: {
              FirebaseAuth.applyActionCode(oobCode).addOnSuccessListener(resultCode -> {
              Log.i(TAG, "Verified email");
              finish();
              }).addOnFailureListener(resultCode -> Log.w(TAG, "Failed to Verified Email", resultCode));
              break;
              }
              case ActionCodeResult.PASSWORD_RESET: {
              Intent passWordResetInetemnt = new Intent(MainActivity.this, PassWordReset.class);
        passWordResetInetemnt.putExtra("oobCode", oobCode);
        startActivity(passWordResetInetemnt);
        finish();
        break;
        }
        }
        }).addOnFailureListener(result -> {
        Log.w(TAG, "Invalid code sent");
        finish();
        });
        }
        }
        }).addOnFailureListener(result -> {
        Log.w(TAG, "Failed to get dynamic link");
        finish();
        });
    private void handleIntent(Intent intent) {
        String appLinkAction = intent.getAction();
        Uri appLinkData = intent.getData();
    }

    public void createDynamicLink_Basic() {
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
    }*/


    /*public void createShortLink() {
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

