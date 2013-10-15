import os
import urllib
import jinja2
import webapp2
import cgi

from google.appengine.api import users
from google.appengine.ext import ndb

JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'])

class DataObject(ndb.Model):
    content = ndb.TextProperty(required=True) # defaults to non-indexed
    date = ndb.DateTimeProperty(auto_now_add=True, indexed=False)


class MainPage(webapp2.RequestHandler):

    def get(self):
        template = JINJA_ENVIRONMENT.get_template('index.html')
        self.response.write(template.render())

class WriteDataObject(webapp2.RequestHandler):

    def post(self):
        data = DataObject()

        data.content = self.request.get('content')
        data.put()


application = webapp2.WSGIApplication([
    ('/', MainPage),
    ('/submit', WriteDataObject),
], debug=True)
